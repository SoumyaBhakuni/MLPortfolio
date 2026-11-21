# MLPortfolio — Interactive Machine Learning Internship Portfolio

**MLPortfolio** is an interactive full-stack web application and machine learning repository developed to document, execute, and demonstrate the practical work completed during the Industrial Training / Machine Learning Internship at **Happieloop Technologies** (**10 July – 9 August 2026**).

The platform unifies ten core machine learning assignments in a single cohesive system, combining a **React + Vite + Tailwind CSS** frontend, a **Flask** REST API backend, standalone **Python** experiment scripts and Jupyter notebooks, interactive **Plotly / SVG** visualizations, and serialized **Joblib** model artifacts.

---

## Key Features

- **Unified Full-Stack ML Lab:** Interactive pages for all ten machine learning assignments with real-time parameter controls, live inference, and metric cards.
- **Route–Service Backend Architecture:** Clean Flask blueprint separation (`routes/`) delegating preprocessing, model inference, and evaluation to dedicated service modules (`services/`).
- **Transparent Dataset & Fallback Reporting:** Explicitly distinguishes real/built-in datasets from synthetic demonstration datasets and flags fallback heuristics (`is_fallback: true`) whenever pretrained vision weights are unavailable.
- **Cached Inference & Single-Source-of-Truth Pipelines:** Caches the `digits_mlp.joblib` neural network in memory without retraining per request and reads `monthly_sales.csv` directly for ARIMA forecasting with ADF stationarity checks.
- **Interactive Internship & Credential Portal:** Includes an embedded page-flipping PDF viewer (`Machine Learning-1.pdf`) with height (`500px` / `720px` / `920px`) and full-screen controls alongside fitted credential cards (`Offer-Letter.jpeg` and `Certificate.jpeg`).

---

## Ten Machine Learning Assignments

| Task | Module | Algorithm / Technique | Dataset / Input |
| :--- | :--- | :--- | :--- |
| **01** | `01_EDA` | Statistical Profiling & Multi-Variate EDA | Iris Flower Dataset (`150 × 5`, Real/Built-In) |
| **02** | `02_Linear_Regression` | Ordinary Least Squares (`LinearRegression`) | Synthetic Housing Dataset (`area_sqft -> price_usd`) |
| **03** | `03_Image_Classification` | `MobileNetV2` (ImageNet `224×224×3`) + Fallback | Labelled Test Set & Validated RGB Uploads |
| **04** | `04_KMeans_Clustering` | `StandardScaler` + `KMeans` & Elbow Inertia | Synthetic Customer Segmentation (`120`–`125` rows) |
| **05** | `05_Decision_Tree` | CART `DecisionTreeClassifier` (`max_depth`) | Iris Flower Dataset (`150 × 4`, Real/Built-In) |
| **06** | `06_Naive_Bayes` | `TfidfVectorizer` + `MultinomialNB` | SMS Spam Collection (`dataset/sms_spam.csv`) |
| **07** | `07_PCA` | `StandardScaler` + Principal Component Analysis | Iris Flower Dataset (`4D -> kD`, Real/Built-In) |
| **08** | `08_Neural_Network` | Multi-Layer Perceptron (`MLPClassifier`, ReLU) | Scikit-Learn `8×8` Digits (`1,797` samples) |
| **09** | `09_ARIMA` | `ARIMA(p, d, q)` + ADF Stationarity Check | Monthly Sales CSV (`dataset/monthly_sales.csv`, `36` periods) |
| **10** | `10_SVM` | Binary `SVC` (`StandardScaler`, Linear/RBF) | Iris Dataset (*Setosa* vs. *Versicolor*) |

---

## System Architecture

+-------------------------------------------------------------------+
|                     React Frontend (Vite + Tailwind)              |
|  Home | About | Projects | 10 Interactive Lab Pages | Internship  |
+---------------------------------+---------------------------------+
                                  |
                                  | HTTP / JSON & Multipart FormData
                                  v
+-------------------------------------------------------------------+
|                   Flask REST API Backend (app.py)                 |
|  Blueprints (routes/)  --->  Task Services (services/)            |
+---------------------------------+---------------------------------+
                                  |
                  +---------------+---------------+
                  |                               |
                  v                               v
+-----------------------------------+   +---------------------------+
|    ML Experiments (ml_projects/)  |   |  Saved Models (models/)   |
|  datasets/ | src/ | notebooks/    |   |  *.joblib & MobileNetV2   |
+-----------------------------------+   +---------------------------+

---

## Technology Stack

    Frontend: React 19, Vite, React Router, Tailwind CSS 4, Axios, Plotly.js (react-plotly.js), Lucide React, React Icons

    Backend: Python 3, Flask, Flask-CORS, Gunicorn

    Machine Learning & Data Science: Scikit-learn, Statsmodels, TensorFlow / Keras (MobileNetV2), NumPy, Pandas, SciPy, Pillow, Joblib, Matplotlib, Seaborn

    Documentation & Deliverables: Markdown, Jupyter Notebooks (.ipynb), LaTeX (pdflatex / latexmk)

---

## Repository Structure

mlportfolio/
├── .gitignore
├── README.md                  # Root project documentation (this file)
│
├── backend/                   # Flask REST API, blueprints, services, and utilities
│   ├── README.md
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── frontend/                  # React + Vite web application and public PDF/image assets
│   ├── README.md
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│
├── ml_projects/               # Standalone scripts, datasets, notebooks, and outputs (Tasks 01–10)
│   ├── README.md
│   ├── requirements.txt
│   ├── 01_EDA/ ... 10_SVM/
│
├── models/                    # Canonical serialized .joblib model artifacts by category
│   ├── README.md
│   ├── classification/
│   ├── clustering/
│   ├── neural_network/
│   ├── regression/
│   └── time_series/
│
├── documentation/             # Technical architecture, API, dataset, and setup guides
│   └── README.md
│
├── report/                    # LaTeX source files for the Industrial Training Report
│   ├── README.md
│   ├── main.tex
│   ├── references.bib
│   └── chapters/
│
└── presentation/              # Seminar presentation source deck, PDF export, and visual assets
    └── README.md

---

## Prerequisites

Tool	                             Purpose
Python 3.10+	             Backend Flask API and ML experiment scripts
pip          	             Python dependency management
Node.js 18+ & npm	         Frontend                      Vite development server and production builds
Git                          Version control
LaTeX (pdflatex / latexmk)	 Compiling report/main.tex into PDF
Modern Web Browser	         Viewing the web UI and embedded PDF viewer

---

## Installation & Setup

1. Clone or Extract the Repository
Bash

git clone <repository-url>
cd mlportfolio

2. Backend Setup

Create and activate a virtual environment, then install backend dependencies:

Linux / macOS:
Bash

python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

Windows (Command Prompt / PowerShell):
Bash

python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt

(Optional) If running standalone ML experiment scripts or notebooks separately, install ml_projects/requirements.txt into the same environment:
Bash

pip install -r ml_projects/requirements.txt

3. Frontend Setup
Bash

cd frontend
cp .env.example .env    # On Windows: copy .env.example .env
npm install

Ensure frontend/.env points to your backend URL:
Code snippet

VITE_API_URL=http://localhost:5000

---

## Running the Application

Start the Backend Server (Terminal 1)
Bash

cd backend
python app.py

    Backend API: http://localhost:5000

    Health Check: http://localhost:5000/api/health

    Task Catalogue: http://localhost:5000/api/tasks

Start the Frontend Development Server (Terminal 2)
Bash

cd frontend
npm run dev

    Frontend UI: http://localhost:5173

---

## Module Documentation Index

    backend/README.md — API endpoints, route–service architecture, environment configuration, and Gunicorn deployment

    frontend/README.md — Pages, components, routing, API client, PDF viewer, and build commands

    ml_projects/README.md — Shared experiment conventions, dataset categories, and per-task execution guides

    models/README.md — Model artifact inventory, training sources, loading behavior, and compatibility rules

    documentation/README.md — Central index for system architecture, API reference, dataset provenance, and troubleshooting

    report/README.md — LaTeX report chapter structure and pdflatex / latexmk compilation instructions

    presentation/README.md — Seminar presentation slide structure, exported PDF, and visual assets

---

## Author & Acknowledgements

    Author: Soumya Bhakuni

    Training Organization: Happieloop Technologies

    Training Period: 10 July – 9 August 2026