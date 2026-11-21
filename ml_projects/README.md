### 4. `ml_projects/README.md`

```markdown
# Machine Learning Task Modules (`ml_projects/`)

The `ml_projects/` directory contains the ten standalone Python machine learning modules developed during the Industrial Training / Machine Learning Internship at **Happieloop Technologies** (**10 July – 9 August 2026**). Each module provides reproducible scripts, Jupyter notebooks, input datasets (where applicable), generated visualizations, and JSON/CSV evaluation summaries.

---

## Directory Structure

```text
ml_projects/
│
├── README.md
├── requirements.txt
│
├── 01_EDA/
├── 02_Linear_Regression/
├── 03_Image_Classification/
├── 04_KMeans_Clustering/
├── 05_Decision_Tree/
├── 06_Naive_Bayes/
├── 07_PCA/
├── 08_Neural_Network/
├── 09_ARIMA/
└── 10_SVM/

```

---

## Experiment Organization & Conventions

Each task folder follows a consistent internal layout:

```text
<NN_Task_Name>/
├── README.md              # Task-specific overview, dataset details, and run instructions
├── dataset/               # Local CSV or sample image inputs (omitted when using built-in sklearn datasets)
├── notebooks/             # Interactive Jupyter notebook (.ipynb) for step-by-step exploration
├── src/                   # Standalone executable Python implementation script (.py)
└── outputs/
    ├── graphs/            # Saved PNG plots (confusion matrices, regression fits, variance curves, forecasts)
    └── statistics/        # Saved JSON and CSV evaluation summaries

```

### Dataset Provenance Categories

To maintain clarity during evaluation, datasets across the ten tasks fall into three explicit categories:

1. **Real / Built-In Benchmark Datasets:**
* *Iris Flower Dataset* (`150` rows, `4` features, `3` species): Used in `01_EDA` (`dataset/iris.csv`), `05_Decision_Tree`, `07_PCA`, and `10_SVM` (filtered to *Setosa* vs. *Versicolor*).
* *SMS Spam Collection* (`dataset/sms_spam.csv`, `5,574` messages): Used in `06_Naive_Bayes`.
* *Scikit-Learn Digits Dataset* (`load_digits`, `1,797` samples of `8×8` pixel grids): Used in `08_Neural_Network`.


2. **Synthetic / Demonstration CSV Datasets:**
* *Synthetic Housing Dataset* (`02_Linear_Regression/dataset/housing.csv`): `120`–`150` generated rows mapping `area_sqft` to `price_usd`.
* *Synthetic Customer Segmentation Dataset* (`04_KMeans_Clustering/dataset/customers.csv`): `120`–`125` generated rows of `annual_income_k` and `spending_score`.
* *Synthetic Monthly Sales Dataset* (`09_ARIMA/dataset/monthly_sales.csv`): `36` monthly observations (`2023-01-01` to `2025-12-01`) with trend and annual seasonality used as the single source of truth by both `arima.py` and `backend/services/arima_service.py`.


3. **Labelled Sample & Uploaded RGB Images:**
* *Sample Test Images* (`03_Image_Classification/dataset/sample_*.png`): Structured `224×224×3` RGB test scenes with ground-truth labels evaluated by `MobileNetV2` (or flagged fallback heuristic).



---

## Task Inventory & Execution Commands

Run any standalone task script from the repository root (`mlportfolio/`) to regenerate its graphs, statistics, and serialized `.joblib` model:

| Task Folder | Script Command | Generated Artifacts & Outputs |
| --- | --- | --- |
| `01_EDA` | `python3 ml_projects/01_EDA/src/eda.py` | `outputs/statistics/summary_statistics.csv`, `eda_summary.json`, 6 PNG plots |
| `02_Linear_Regression` | `python3 ml_projects/02_Linear_Regression/src/linear_regression.py` | `models/regression/linear_regression.joblib`, `regression_fit.png`, `metrics.json` |
| `03_Image_Classification` | `python3 ml_projects/03_Image_Classification/src/image_classification.py` | `dataset/sample_*.png`, `sample_confidences.png`, `predictions.json`, `evaluation_metrics.json` |
| `04_KMeans_Clustering` | `python3 ml_projects/04_KMeans_Clustering/src/kmeans.py` | `models/clustering/kmeans.joblib`, `elbow_curve.png`, `clusters_scatter.png`, `cluster_summary.json` |
| `05_Decision_Tree` | `python3 ml_projects/05_Decision_Tree/src/decision_tree.py` | `models/classification/decision_tree.joblib`, `tree_diagram.png`, `confusion_matrix.png`, `metrics.json` |
| `06_Naive_Bayes` | `python3 ml_projects/06_Naive_Bayes/src/naive_bayes.py` | `models/classification/naive_bayes.joblib`, `metrics.json` |
| `07_PCA` | `python3 ml_projects/07_PCA/src/pca.py` | `outputs/graphs/explained_variance.png`, `pca_projection_2d.png`, `pca_summary.json` |
| `08_Neural_Network` | `python3 ml_projects/08_Neural_Network/src/neural_network.py` | `models/neural_network/digits_mlp.joblib`, `training_loss.png`, `confusion_matrix.png`, `metrics.json` |
| `09_ARIMA` | `python3 ml_projects/09_ARIMA/src/arima.py` | `models/time_series/arima_model.joblib`, `acf_pacf.png`, `forecast.png`, `forecast_summary.json` |
| `10_SVM` | `python3 ml_projects/10_SVM/src/svm.py` | `models/classification/svm.joblib`, `confusion_matrix.png`, `metrics.json` |

---

## Dependencies & Environment Relationship

The repository maintains two dependency manifests:

* `backend/requirements.txt` — Flask, Gunicorn, and all ML runtime packages required to serve the REST API.
* `ml_projects/requirements.txt` — Core data science, plotting (`matplotlib`, `seaborn`), and Jupyter packages for standalone script and notebook execution.

Both files can be installed into the same project virtual environment (`.venv`) so standalone scripts and the Flask backend share identical `scikit-learn`, `statsmodels`, `numpy`, and `pandas` versions:

```bash
pip install -r backend/requirements.txt -r ml_projects/requirements.txt

```

```

---

