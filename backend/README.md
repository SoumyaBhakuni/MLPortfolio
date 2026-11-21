

---

### 2. `backend/README.md`

```markdown
# Backend API & ML Inference Service (`backend/`)

The `backend/` directory implements the Python **Flask** REST API that powers all ten interactive machine learning modules in **MLPortfolio** for the **Happieloop Technologies** Industrial Training submission (**10 July – 9 August 2026**).

---

## Folder & File Tree

```text
backend/
│
├── README.md
├── app.py
├── config.py
├── requirements.txt
│
├── routes/
│   ├── __init__.py
│   ├── eda_routes.py
│   ├── regression_routes.py
│   ├── image_routes.py
│   ├── clustering_routes.py
│   ├── decision_tree_routes.py
│   ├── naive_bayes_routes.py
│   ├── pca_routes.py
│   ├── neural_network_routes.py
│   ├── arima_routes.py
│   └── svm_routes.py
│
├── services/
│   ├── __init__.py
│   ├── eda_service.py
│   ├── regression_service.py
│   ├── image_service.py
│   ├── clustering_service.py
│   ├── decision_tree_service.py
│   ├── naive_bayes_service.py
│   ├── pca_service.py
│   ├── neural_network_service.py
│   ├── arima_service.py
│   └── svm_service.py
│
└── utils/
    ├── __init__.py
    ├── preprocessing.py
    ├── metrics.py
    └── visualization.py

```

---

## File Responsibilities

| File | Responsibility |
| --- | --- |
| `app.py` | Initializes the Flask application, configures CORS, registers all blueprints from `ALL_BLUEPRINTS`, exposes `/api/health` and `/api/tasks`, and defines JSON error handlers. |
| `config.py` | Defines environment-driven runtime settings (`FLASK_HOST`, `FLASK_PORT`, `FLASK_DEBUG`, `CORS_ORIGINS`), relative project paths (`BASE_DIR`, `PROJECT_ROOT`, `ML_PROJECTS_DIR`, `MODELS_DIR`), and the 10-task catalogue. |
| `requirements.txt` | Lists Python dependencies required for Flask, Gunicorn, Scikit-learn, Statsmodels, TensorFlow/Keras, Pillow, NumPy, and Pandas. |
| `routes/__init__.py` | Collects all ten task Flask blueprints into `ALL_BLUEPRINTS`. |
| `routes/*_routes.py` | Parses and validates incoming HTTP requests (JSON payloads or multipart image uploads), invokes the corresponding service function, and returns structured JSON responses. |
| `services/*_service.py` | Encapsulates task-specific preprocessing, model loading/inference, time-series forecasting, and evaluation metric computation. |
| `utils/preprocessing.py` | Shared input validation and preprocessing utilities. |
| `utils/metrics.py` | Shared classification and regression evaluation helpers (`classification_metrics_dict`, etc.). |
| `utils/visualization.py` | Shared chart/plot formatting helpers. |

---

## Request–Response Architecture

```text
React Frontend
      |
      | HTTP Request (JSON / Multipart FormData)
      v
Flask Application (app.py)
      |
      v
Task Blueprint (routes/*_routes.py)
      |
      v
Task Service (services/*_service.py)
      |
      v
Dataset / Serialized Joblib Artifact / Pretrained MobileNetV2
      |
      v
Structured JSON Response

```

---

## API Endpoints & Blueprints

### System Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Returns backend health status and registered task count. |
| `/api/tasks` | `GET` | Returns metadata and status entries for all 10 ML tasks. |

### Task Blueprint Endpoints

| Blueprint | Endpoint | Method | Input | Description |
| --- | --- | --- | --- | --- |
| `eda_bp` | `/api/task01/eda` | `GET` | Query `export=true/false` | Returns Iris summary statistics, quartiles, correlations, and class counts. |
| `eda_bp` | `/api/task01/scatter` | `GET` | Query `x`, `y` | Returns paired feature coordinates grouped by Iris species. |
| `regression_bp` | `/api/task02/predict` | `POST` | JSON `{ "area_sqft": number }` | Predicts `price_usd` via OLS and returns line points and $R^2$/MSE/RMSE/MAE. |
| `image_bp` | `/api/task03/classify` | `POST` | Multipart `file` or JSON `{ "filename", "image_base64", "true_label" }` | Validates and classifies `224×224×3` RGB images via cached `MobileNetV2` (or flagged fallback), returning top-5 predictions and labelled test-set confusion matrix. |
| `clustering_bp` | `/api/task04/cluster` | `POST` | JSON `{ "n_clusters": int }` | Runs standardized K-Means clustering, elbow inertia (`K=1..8`), and centroid assignment. |
| `decision_tree_bp` | `/api/task05/predict` | `POST` | JSON `{ "features": [...], "max_depth": int }` | Predicts Iris species via CART `DecisionTreeClassifier` and returns weighted metrics. |
| `naive_bayes_bp` | `/api/task06/predict` | `POST` | JSON `{ "message": string }` | Classifies SMS text as Spam or Ham using TF-IDF + `MultinomialNB`. |
| `pca_bp` | `/api/task07/transform` | `POST` | JSON `{ "n_components": int }` | Projects standardized 4D Iris features into `1..4` principal components with variance ratios. |
| `neural_network_bp` | `/api/task08/predict` | `POST` | JSON `{ "pixels": [64 floats] }` | Predicts digit `0–9` from an `8×8` canvas grid using cached `digits_mlp.joblib`. |
| `arima_bp` | `/api/task09/forecast` | `POST` | JSON `{ "steps": int, "order": [p, d, q] }` | Reads `ml_projects/09_ARIMA/dataset/monthly_sales.csv`, runs ADF stationarity checks, evaluates chronological holdout MAE/RMSE, and returns historical, fitted, and forecast series. |
| `svm_bp` | `/api/task10/predict` | `POST` | JSON `{ "features", "kernel", "C", "gamma" }` | Runs binary `SVC` classification (*Setosa* vs. *Versicolor*) and returns support vector counts. |

---

## Service-Specific Implementation Notes

* **Task 03 (`image_service.py`):** Validates allowed formats (`JPEG`, `PNG`, `WEBP`, `GIF`), max upload size (`8 MB`), and max image dimensions (`4096×4096`). Uses cached `MobileNetV2(weights="imagenet")` when available and sets `is_fallback: true` with `fallback_reason` if TensorFlow/weights cannot be loaded.
* **Task 08 (`neural_network_service.py`):** Loads `models/neural_network/digits_mlp.joblib` once into a thread-safe module cache (training and saving once only if missing) instead of retraining per HTTP request.
* **Task 09 (`arima_service.py`):** Loads `ml_projects/09_ARIMA/dataset/monthly_sales.csv` directly rather than generating synthetic data in memory, runs Augmented Dickey-Fuller (`adfuller`) stationarity checks, and separates the 6-month chronological holdout split from the final full-series forecast.

---

## Environment Variables & Configuration

`backend/config.py` reads the following environment variables from the shell or deployment environment (note: `load_dotenv()` is not invoked automatically unless explicitly added):

| Variable | Default | Purpose |
| --- | --- | --- |
| `FLASK_HOST` | `0.0.0.0` | Host interface bound by the Flask server |
| `FLASK_PORT` | `5000` | Port bound by the Flask server |
| `FLASK_DEBUG` | `false` | Enables or disables Flask debug mode |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000` | Comma-separated allowed frontend origins |

All internal directory paths (`BASE_DIR`, `PROJECT_ROOT`, `ML_PROJECTS_DIR`, `MODELS_DIR`) are computed dynamically relative to `backend/config.py`.

---

## Error Handling

`app.py` registers custom JSON error handlers for HTTP `404` (Not Found), `405` (Method Not Allowed), and `500` (Internal Server Error), as well as `ValueError` / validation handling in routes so clients consistently receive structured JSON error payloads instead of HTML error pages.

---

## Running the Backend

### Local Development Server

```bash
cd backend
python app.py

```

Default URL: `http://localhost:5000`

### Production WSGI Server (Gunicorn)

`app.py` exposes a module-level `app` instance compatible with Gunicorn on Linux:

```bash
cd backend
gunicorn --workers 2 --bind 0.0.0.0:5000 app:app

```

Or from the repository root:

```bash
gunicorn --chdir backend --workers 2 --bind 0.0.0.0:5000 app:app

```

```

---

