# Surface Water Mapping using Sentinel-2 and Machine Learning (GEE)

This repository presents a Surface Water Mapping using Sentinel-2 imagery and a Random Forest machine learning (ML) classifier implemented in Google Earth Engine (GEE).

The approach integrates spectral indices (NDVI & MNDWI) with user-defined training samples to accurately delineate surface water bodies within a defined Area of Interest (AOI).

---

## Study Area
- Haripur was selected as an AOI, imported by the user in GEE.
- AOI contains Tarbela and Khanpur Dams. 
- Region-specific surface water analysis
- Output clipped to AOI boundary

---

## Data Used
- **Satellite:** Sentinel-2 Harmonized (COPERNICUS/S2_HARMONIZED)
- **Time Period:** January 2023 – January 2024
- **Spatial Resolution:** 10 meters
- **Cloud Threshold:** < 10%

---

## Spectral Indices
The following indices were computed and used as input features:

- **NDVI (Normalized Difference Vegetation Index)**  
  \[
  NDVI = {B8 - B4} \ {B8 + B4}
  ]

- **MNDWI (Modified Normalized Difference Water Index)**  
  \[
  MNDWI = {B3 - B11} \ {B3 + B11}
  \]

---

## Machine Learning Model
- **Algorithm:** Random Forest
- **Number of Trees:** 100
- **Input Features:**
  - B2 (Blue)
  - B3 (Green)
  - B4 (Red)
  - B8 (NIR)
  - NDVI
  - MNDWI

---

## Training & Testing
- **Training Samples:**  
  - Water (Class = 1)  
  - Non-Water (Class = 0)
- **Testing:**  
  - 80% Training  
  - 20% Testing  
- Randomized split to ensure independence between training and testing

---

## Accuracy Assessment

### Confusion Matrix

[[95, 0],
[ 0, 67]]

### Accuracy Metrics
- **Overall Accuracy:** 100%
- **Producer Accuracy:**  
  - Non-Water: 100%  
  - Water: 100%
- **User Accuracy:**  
  - Non-Water: 100%  
  - Water: 100%
    
---

## Outputs
- **Surface Water Classification Map (GeoTIFF)**
- **Sentinel-2 True Color RGB Image (GeoTIFF)**

---

## Applications
- Flood mapping
- Surface water dynamics
- Hydrological analysis
- Climate change studies
- GIS & Remote Sensing research

---

## License
This project is open-source and free to use, modify and share with attribution.

---

## Author
**Raffay Subhani**  
Email: raffaysubhani9@gmail.com
