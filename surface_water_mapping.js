// Load Shp
var roi = ee.FeatureCollection('projects/banded-equinox-420006/assets/AOI');
Map.centerObject(roi, 9);
Map.addLayer(roi, {color: 'red'}, 'AOI');

// NDVI & MNDWI Functions
var addIndices = function(image) {
  var ndvi  = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var mndwi = image.normalizedDifference(['B3', 'B11']).rename('MNDWI');
  return image.addBands([ndvi, mndwi]);
};

// Sentinel-2
var image = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterDate('2023-01-01', '2024-01-01')
  .filterBounds(roi)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .map(addIndices)
  .median()
  .clip(roi);

// Visualization
Map.addLayer(
  image,
  {bands: ['B4','B3','B2'], min: 0, max: 3000},
  'Sentinel-2 Imagery'
);

// Water sample asset
var Water = ee.FeatureCollection('projects/banded-equinox-420006/assets/Water');

// Assigning of class labels
var waterSamples = Water.map(function(f) {
  return f.set('Class', 1);
});

var nonWaterSamples = Non_Water.map(function(f) {
  return f.set('Class', 0);
});

// Merge training samples
var trainingSamples = waterSamples.merge(nonWaterSamples);

// Bands
var bands = ['B2', 'B3', 'B4', 'B8', 'NDVI', 'MNDWI'];
var input = image.select(bands);

// Samples using Training Data
var samples = input.sampleRegions({
  collection: trainingSamples,
  properties: ['Class'],
  scale: 10,
  tileScale: 4
});

// Training & Testing 
var samplesRandom = samples.randomColumn('random');

var trainSet = samplesRandom.filter(ee.Filter.lt('random', 0.8));
var testSet  = samplesRandom.filter(ee.Filter.gte('random', 0.8));

// Random Forest Classifier ML
var classifier = ee.Classifier.smileRandomForest(100)
  .train({
    features: trainSet,
    classProperty: 'Class',
    inputProperties: bands
  });

// Classification
var classified = input.classify(classifier);

// Extract water only and clip to AOI
var water = classified.eq(1).selfMask().clip(roi);

Map.addLayer(
  water,
  {palette: ['blue']},
  'Surface Water'
);

// Accuracy Assessment
var validated = testSet.classify(classifier);

var confusionMatrix = validated.errorMatrix(
  'Class',
  'classification'
);

print('Confusion Matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Producer Accuracy:', confusionMatrix.producersAccuracy());
print('User Accuracy:', confusionMatrix.consumersAccuracy());

// Export to Drive
Export.image.toDrive({
  image: water,
  description: 'Surface_Water_Mapping',
  scale: 10,
  region: roi,
  maxPixels: 1e13
});

// Export Sentinel-2 True Color (RGB)
Export.image.toDrive({
  image: image.select(['B4', 'B3', 'B2']).clip(roi),
  description: 'Sentinel_2_TrueColor',
  scale: 10,
  region: roi,
  maxPixels: 1e13
});