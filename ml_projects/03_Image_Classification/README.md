# Task 01 — Exploratory Data Analysis (Iris Dataset)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Dataset:** Iris Flower Dataset (150 observations, 4 numerical features, 3 species)
- **Run Script:** `python3 ml_projects/01_EDA/src/eda.py`
- **Outputs:** `outputs/statistics/summary_statistics.csv`, `outputs/statistics/eda_summary.json`, and# Task 03 — Image Classification Using Pre-Trained Model

- **Model:** MobileNetV2 (with deterministic feature fallback when Keras/ImageNet weights are offline)
- **Run Script:*# Task 03 — Image Classification Using Pre-Trained Model

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)[cite: 3, 6, 8]
- **Model:** MobileNetV2 (`224×224×3` RGB input, ImageNet weights) with explicit deterministic feature fallback when TensorFlow/weights are unavailable
- **Run Script:** `python3 ml_projects/03_Image_Classification/src/image_classification.py`
- **Sample Inputs:** Multi-pattern test images in `dataset/` (`sample_checkerboard.png`, `sample_radial_wave.png`, `sample_geometric_shapes.png`) or user-uploaded images via the web interface
- **Outputs:** `outputs/graphs/sample_confidences.png` and `outputs/statistics/predictions.json`

## Overview
This task performs image classification by resizing RGB images to `224×224×3` and running inference with a cached `MobileNetV2` model pretrained on ImageNet, returning top-5 class predictions and confidence scores. If TensorFlow or pretrained weights cannot be loaded, the backend and script explicitly flag fallback mode (`is_fallback: true`) rather than presenting heuristic scores as genuine `MobileNetV2` inference.* `python3 ml_projects/03_Image_Classification/src/image_classification.py`
- **Artifacts:** `dataset/sample_*.png`, `outputs/graphs/sample_confidences.png`, `outputs/statistics/predictions.json`. 6 plots in `outputs/graphs/`.