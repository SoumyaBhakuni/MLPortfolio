# Task 03 — Image Classification Using Pre-Trained Model

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `03_Image_Classification` — MobileNetV2 (`224×224×3` RGB input, ImageNet weights) with explicit deterministic feature fallback when TensorFlow/weights are unavailable
- **Dataset / Inputs:** Labelled test images (`dataset/sample_*.png`) and validated user-uploaded RGB images (JPEG, PNG, WebP, GIF) resized to `224×224×3`
- **API Endpoint:** `/api/task03/classify`

## Overview
Validates image inputs, resizes RGB images to `224×224×3`, and runs inference with a cached `MobileNetV2` model pretrained on ImageNet to return top-5 class predictions, confidence scores, true vs. predicted label comparisons, and evaluation metrics (accuracy and confusion matrix) on the labelled test set. If TensorFlow or pretrained weights cannot be loaded, the backend and script explicitly flag fallback mode (`is_fallback: true`) rather than presenting heuristic scores as genuine `MobileNetV2` inference.

## How to Run
```bash
python3 ml_projects/03_Image_Classification/src/image_classification.py