

### 8. `presentation/README.md`

```markdown
# Seminar & Industrial Training Presentation (`presentation/`)

The `presentation/` directory stores the seminar slide deck, exported PDF deliverable, and high-resolution visual assets for the Industrial Training evaluation at **Happieloop Technologies** (**10 July – 9 August 2026**).

*(Note: A web-viewable copy of the presentation PDF is also kept at `frontend/public/Presentation.pdf` for the portfolio's Internship PDF viewer.)*

---

## Folder & File Tree

```text
presentation/
│
├── README.md
├── Industrial_Training_Presentation.pptx   # Editable seminar slide deck
├── Industrial_Training_Presentation.pdf    # Exported PDF for presentation & archiving
│
└── assets/
    ├── system_architecture.png
    ├── homepage.png
    ├── project_dashboard.png
    ├── task01_eda.png
    ├── task02_regression.png
    ├── task03_image_classification.png
    ├── task04_kmeans.png
    ├── task05_decision_tree.png
    ├── task06_naive_bayes.png
    ├── task07_pca.png
    ├── task08_neural_network.png
    ├── task09_arima.png
    └── task10_svm.png

```

---

## Slide Structure (14 Slides)

| Slide | Title / Topic | Key Talking Points |
| --- | --- | --- |
| **01** | Title & Student Details | Project title (*MLPortfolio*), student name, training dates (`10 July – 9 August 2026`), Happieloop Technologies |
| **02** | Organization Profile | Overview of Happieloop Technologies and training domain |
| **03** | Internship Overview | End-to-end objectives: bridging standalone ML algorithms with a production-style web interface |
| **04** | Scope & Dataset Provenance | Breakdown of real/built-in datasets, synthetic demonstration CSVs, and labelled image test sets |
| **05** | Machine Learning Pipeline Overview | Supervised, unsupervised, deep learning, and time-series workflows |
| **06** | Technology Stack & Tools | React 19, Vite, Tailwind CSS, Plotly, Flask, Gunicorn, Scikit-learn, Statsmodels, TensorFlow/MobileNetV2 |
| **07** | Tasks 01 & 02: EDA & Linear Regression | Iris statistical profiling and OLS housing price regression ($R^2$, RMSE) |
| **08** | Tasks 03 & 04: Image Classification & K-Means | Cached `MobileNetV2` (`224×224×3`) with fallback disclosure; standardized K-Means & elbow curve |
| **09** | Tasks 05 & 06: Decision Tree & Naive Bayes | Depth-controlled CART on Iris; TF-IDF + `MultinomialNB` SMS spam filtering |
| **10** | Tasks 07 & 08: PCA & Neural Network | Standardized Iris variance projection; cached `digits_mlp.joblib` on `8×8` Digits |
| **11** | Tasks 09 & 10: ARIMA & SVM | `monthly_sales.csv` forecasting with ADF stationarity check & chronological validation; binary `SVC` |
| **12** | Full-Stack System Architecture | Request flow from React UI through Flask blueprints/services to cached models and charts |
| **13** | Live UI & Consolidated Metrics | Screenshots of the web application, interactive canvas/uploaders, and evaluation summary |
| **14** | Conclusion & Future Scope | Engineering takeaways, limitations, and next steps |

```

```