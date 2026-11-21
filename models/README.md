### 5. `models/README.md`

```markdown
# Serialized Model Artifacts (`models/`)

The `models/` directory at the repository root is the canonical storage location for serialized machine learning artifacts (`.joblib`) produced by the training scripts in `ml_projects/` and consumed by the backend inference services in `backend/services/`.

---

## Folder & File Tree

```text
models/
│
├── README.md
│
├── classification/
│   ├── decision_tree.joblib
│   ├── naive_bayes.joblib
│   └── svm.joblib
│
├── clustering/
│   └── kmeans.joblib
│
├── neural_network/
│   └── digits_mlp.joblib
│
├── regression/
│   └── linear_regression.joblib
│
└── time_series/
    └── arima_model.joblib

```

*(Note: Ensure `models/` at the repository root remains the single canonical model directory; remove any duplicate copies under `ml_projects/models/` if present.)*

---

## Model Inventory, Provenance & Runtime Loading

| Artifact Path | Task | Training Script | Stored Contents & Preprocessing | Runtime Usage |
| --- | --- | --- | --- | --- |
| `models/regression/linear_regression.joblib` | Task 02 (`Linear Regression`) | `ml_projects/02_Linear_Regression/src/linear_regression.py` | Fitted `LinearRegression` OLS model (`area_sqft -> price_usd`) | Persisted experiment artifact; `regression_service.py` computes OLS fit & evaluation metrics |
| `models/clustering/kmeans.joblib` | Task 04 (`K-Means`) | `ml_projects/04_KMeans_Clustering/src/kmeans.py` | Fitted `KMeans` model paired with `StandardScaler` | Persisted experiment artifact; `clustering_service.py` supports dynamic `n_clusters` (`2–10`) and elbow inertia |
| `models/classification/decision_tree.joblib` | Task 05 (`Decision Tree`) | `ml_projects/05_Decision_Tree/src/decision_tree.py` | Fitted CART `DecisionTreeClassifier` on Iris | Persisted experiment artifact; `decision_tree_service.py` supports interactive `max_depth` (`1–12`) |
| `models/classification/naive_bayes.joblib` | Task 06 (`Naive Bayes`) | `ml_projects/06_Naive_Bayes/src/naive_bayes.py` | `TfidfVectorizer` + `MultinomialNB` pipeline/bundle | Loaded/used for SMS Spam vs. Ham text classification |
| `models/neural_network/digits_mlp.joblib` | Task 08 (`Neural Network`) | `ml_projects/08_Neural_Network/src/neural_network.py` | Fitted `MLPClassifier(hidden_layer_sizes=(64, 32), activation="relu")` trained on scaled `8×8` `load_digits` features (`X / 16.0`) | **Loaded and cached once in memory** by `backend/services/neural_network_service.py` (trained and saved only if missing) |
| `models/time_series/arima_model.joblib` | Task 09 (`ARIMA`) | `ml_projects/09_ARIMA/src/arima.py` | Fitted `statsmodels` `ARIMA(1, 1, 1)` results object on `monthly_sales.csv` | Persisted default fit; `arima_service.py` fits user-selected `(p, d, q)` and `steps` directly from `monthly_sales.csv` |
| `models/classification/svm.joblib` | Task 10 (`SVM`) | `ml_projects/10_SVM/src/svm.py` | `StandardScaler` + binary `SVC` (*Setosa* vs. *Versicolor*) | Persisted experiment artifact; `svm_service.py` supports interactive `kernel`, `C`, and `gamma` |

### Tasks Without `.joblib` Files

* **Task 01 (`01_EDA`):** Descriptive statistical profiling and visualization only; no predictive model artifact is required.
* **Task 03 (`03_Image_Classification`):** Uses pretrained `MobileNetV2(weights="imagenet")` weights loaded via TensorFlow/Keras and cached in memory in `backend/services/image_service.py` (with an explicit deterministic feature heuristic fallback when weights/runtime are offline).

---

## Model Directory Guidelines

1. **Canonical Location:** Save all `.joblib` artifacts exclusively under `models/<category>/` relative to the repository root (`PROJECT_ROOT/models/...`).
2. **Preprocessing Coupling:** Whenever a model relies on feature scaling or text vectorization (`StandardScaler`, `TfidfVectorizer`, or `0–16` pixel normalization), store or apply the exact matching transformation during inference.
3. **Version Compatibility:** `joblib` artifacts depend on matching Python and `scikit-learn` / `statsmodels` versions. If upgrading packages causes deserialization warnings or errors, re-run the corresponding training script in `ml_projects/<task>/src/` to regenerate the artifact.

```

---

### 6. `documentation/README.md`

```markdown
# Technical Documentation (`documentation/`)

The `documentation/` directory serves as the centralized technical reference hub for **MLPortfolio**, documenting system architecture, REST API contracts, dataset provenance, model lifecycle rules, and environment setup for the **Happieloop Technologies** Industrial Training submission (**10 July – 9 August 2026**).

---

## Documentation Structure

```text
documentation/
│
├── README.md                  # Documentation index and navigation guide (this file)
│
├── architecture/
│   ├── system-architecture.md # End-to-end React + Flask + ML modules architecture
│   ├── backend-architecture.md# Flask app factory, blueprints, services, and error handling
│   ├── frontend-architecture.md# React Router pages, reusable components, and state flow
│   └── api-architecture.md    # JSON & FormData request/response lifecycle and timeouts
│
├── api/
│   └── api-reference.md       # Complete specification of /api/health, /api/tasks, and Tasks 01–10
│
├── datasets/
│   └── dataset-sources.md     # Provenance, schema, sample counts, and synthetic disclosures
│
├── models/
│   └── model-inventory.md     # Artifact paths, training scripts, caching behavior, and metrics
│
├── development/
│   ├── installation.md        # Clean-machine setup for Python, Node.js, and LaTeX
│   ├── environment-setup.md   # Backend/frontend environment variables and CORS configuration
│   └── troubleshooting.md     # Common fixes for CORS, timeouts, TensorFlow weights, and joblib versions
│
└── assets/
    └── screenshots/           # UI screenshots referenced in documentation, report, and slides

```

---

## Quick Cross-References

* **System & API Implementation:** See [suspicious link removed] and [suspicious link removed].
* **Task Scripts & Notebooks:** See [suspicious link removed] and individual task `README.md` files under `ml_projects/01_EDA/` through `ml_projects/10_SVM/`.
* **Serialized Models:** See [suspicious link removed].
* **Academic Deliverables:** See [suspicious link removed] and [suspicious link removed].

```

---

### 7. `report/README.md`

```markdown
# Industrial Training Report (`report/`)

The `report/` directory contains the **LaTeX** source files, bibliography, and chapter structure for the formal Industrial Training Report submitted for the Machine Learning Internship at **Happieloop Technologies** (**10 July – 9 August 2026**).

*(Note: A web-viewable PDF copy is also maintained at `frontend/public/Report-File.pdf` for display on the portfolio's Internship page.)*

---

## Folder & File Tree

```text
report/
│
├── README.md
├── main.tex                   # Master LaTeX document (preamble, title page, front matter, \include chapters)
├── references.bib             # BibTeX bibliography entries for datasets, frameworks, and papers
│
├── chapters/
│   ├── chapter1.tex           # Chapter 1: Introduction, Organization Profile & Internship Background
│   ├── chapter2.tex           # Chapter 2: Internship Objectives, Scope, Schedule & Work Undertaken
│   ├── chapter3.tex           # Chapter 3: Technologies, Development Environment & System Architecture
│   ├── chapter4.tex           # Chapter 4: Detailed Implementation of ML Tasks (Tasks 01–10)
│   ├── chapter5.tex           # Chapter 5: Experimental Results, Evaluation Metrics & Visualizations
│   └── chapter6.tex           # Chapter 6: Conclusion, Learning Outcomes, Limitations & Future Scope
│
└── output/                    # Compiled PDF output directory (kept separate from LaTeX sources)
    └── Industrial_Training_Report.pdf

```

---

## Chapter Responsibilities

| File | Scope & Contents |
| --- | --- |
| `main.tex` | Document class, formatting geometry, packages (`graphicx`, `booktabs`, `hyperref`, `listings`, `amsmath`), title page, certificate/declaration pages, abstract, table of contents, list of figures/tables, chapter includes, and bibliography. |
| `chapters/chapter1.tex` | Overview of industrial training, Happieloop Technologies profile, and problem context. |
| `chapters/chapter2.tex` | Training objectives, weekly work breakdown (10 July – 9 August 2026), and deliverables scope. |
| `chapters/chapter3.tex` | Full-stack software architecture (React, Flask, Scikit-learn, Statsmodels, TensorFlow) and dataset provenance methodology. |
| `chapters/chapter4.tex` | Mathematical formulation, preprocessing, and implementation details for Tasks 01 through 10. |
| `chapters/chapter5.tex` | Consolidated evaluation tables ($R^2$, RMSE, MAE, Accuracy, F1, AIC/BIC, Silhouette/Inertia), confusion matrices, and plots from `ml_projects/*/outputs/`. |
| `chapters/chapter6.tex` | Key takeaways, engineering lessons (caching, stationarity checks, fallback transparency), limitations, and future enhancements. |
| `references.bib` | Citations for Scikit-learn, Statsmodels, MobileNetV2, Iris/Digits/SMS Spam datasets, Flask, and React. |

---

## Compilation Instructions

### Option 1: Using `latexmk` (Recommended)

```bash
cd report
mkdir -p output
latexmk -pdf -outdir=output main.tex

```

Clean auxiliary build artifacts:

```bash
latexmk -c -outdir=output main.tex

```

### Option 2: Using `pdflatex` and `bibtex`

```bash
cd report
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex

```

```

---

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