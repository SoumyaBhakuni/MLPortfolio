### 3. `frontend/README.md`

```markdown
# Frontend Web Application (`frontend/`)

The `frontend/` directory contains the **React 19 + Vite + Tailwind CSS** single-page web application for **MLPortfolio**, developed for the Industrial Training / Machine Learning Internship at **Happieloop Technologies** (**10 July – 9 August 2026**).

---

## Folder & File Tree

```text
frontend/
│
├── .env.example
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
│
├── public/
│   ├── Certificate.jpeg
│   ├── Machine Learning-1.pdf
│   ├── Offer-Letter.jpeg
│   ├── Presentation.pdf
│   ├── Report-File.pdf
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    │
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    │
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    │
    ├── components/
    │   ├── ChartContainer.jsx
    │   ├── Footer.jsx
    │   ├── LoadingState.jsx
    │   ├── MetricCard.jsx
    │   ├── Navbar.jsx
    │   ├── ProjectCard.jsx
    │   ├── ScrollToTop.jsx
    │   └── SectionHeading.jsx
    │
    ├── data/
    │   └── projects.js
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── About.jsx
    │   ├── Projects.jsx
    │   ├── Internship.jsx
    │   ├── Contact.jsx
    │   │
    │   └── projects/
    │       ├── EDA.jsx
    │       ├── LinearRegression.jsx
    │       ├── ImageClassification.jsx
    │       ├── KMeans.jsx
    │       ├── DecisionTree.jsx
    │       ├── NaiveBayes.jsx
    │       ├── PCA.jsx
    │       ├── NeuralNetwork.jsx
    │       ├── ARIMA.jsx
    │       └── SVM.jsx
    │
    └── services/
        └── api.js

```

---

## Technology Stack

| Technology | Purpose |
| --- | --- |
| **React 19** | Component-based UI architecture and state management |
| **Vite** | Fast development server with HMR and production bundling |
| **React Router** | Client-side routing via `BrowserRouter`, `Routes`, and `Route` in `App.jsx` |
| **Tailwind CSS 4** | Utility-first styling with dark technical dashboard aesthetic |
| **Axios** | HTTP client communicating with the Flask REST API |
| **Plotly.js & React Plotly** | Interactive scatter plots, regression fits, elbow curves, and time-series charts |
| **Lucide React & React Icons** | Navigation, status, and control iconography |
| **ESLint** | Static code quality and React linting |

---

## Pages & Routes

### Core Portfolio Pages

| Page Component | Route | Purpose |
| --- | --- | --- |
| `Home.jsx` | `/` | Hero overview, internship highlights, featured ML labs, and quick navigation |
| `About.jsx` | `/about` | Developer profile, technical skill groups, and industrial training background |
| `Projects.jsx` | `/projects` | Filterable catalogue of all ten ML assignments driven by `src/data/projects.js` |
| `Internship.jsx` | `/internship` | Training timeline, embedded PDF viewers, and official internship credentials |
| `Contact.jsx` | `/contact` | Contact details, repository links, and submission summary |

### Interactive ML Lab Pages

| Page Component | Route | Backend Endpoint | Interactive Capabilities |
| --- | --- | --- | --- |
| `EDA.jsx` | `/projects/eda` | `/api/task01/eda`, `/api/task01/scatter` | Feature axis selectors, species scatter plot, correlation & quartile tables |
| `LinearRegression.jsx` | `/projects/linear-regression` | `/api/task02/predict` | Interactive `area_sqft` slider/input, OLS line fit, MSE/RMSE/MAE/$R^2$ cards |
| `ImageClassification.jsx` | `/projects/image-classification` | `/api/task03/classify` | Labelled sample presets, image upload (`JPEG/PNG/WebP/GIF`), true vs. predicted label comparison, confusion matrix, and explicit fallback mode warning |
| `KMeans.jsx` | `/projects/kmeans` | `/api/task04/cluster` | Adjustable `K` (`2–10`), elbow inertia curve (`K=1..8`), cluster centroids |
| `DecisionTree.jsx` | `/projects/decision-tree` | `/api/task05/predict` | Adjustable `max_depth` (`1–12`), feature inputs, class probabilities |
| `NaiveBayes.jsx` | `/projects/naive-bayes` | `/api/task06/predict` | Live SMS message input, Spam/Ham classification, token & probability breakdown |
| `PCA.jsx` | `/projects/pca` | `/api/task07/transform` | Component count selector (`1–4`), explained & cumulative variance charts |
| `NeuralNetwork.jsx` | `/projects/neural-network` | `/api/task08/predict` | Interactive `8×8` drawing grid (`0–15` intensity), preset `0`, softmax probability bars, cached `digits_mlp.joblib` status |
| `ARIMA.jsx` | `/projects/arima` | `/api/task09/forecast` | Forecast horizon (`1–24`), `(p, d, q)` order controls, historical/fitted/forecast plot, ADF & AIC/RMSE metrics |
| `SVM.jsx` | `/projects/svm` | `/api/task10/predict` | Kernel (`linear`/`rbf`), `C`, and `gamma` controls, support vector counts |

---

## Shared Components & Metadata

| File | Responsibility |
| --- | --- |
| `components/Navbar.jsx` | Top navigation bar with live `/api/health` backend status indicator |
| `components/Footer.jsx` | Persistent portfolio footer with training and navigation links |
| `components/ScrollToTop.jsx` | Resets scroll position on route transitions |
| `components/ProjectCard.jsx` | Renders task cards with status badge, dataset provenance, tags, and key metrics |
| `components/MetricCard.jsx` | Displays standardized evaluation metrics (`R²`, `RMSE`, `Accuracy`, `AIC`, etc.) |
| `components/ChartContainer.jsx` | Framed layout wrapper with title and subtitle for charts and canvases |
| `components/LoadingState.jsx` | Consistent loading indicator during backend requests |
| `components/SectionHeading.jsx` | Standardized task header displaying task code, title, and API route |
| `data/projects.js` | Central metadata registry (`ML_LABS`, `ALLOWED_STATUSES`, `SKILL_GROUPS`) including explicit dataset provenance |

---

## API Integration (`src/services/api.js`)

All HTTP requests are centralized in `frontend/src/services/api.js` using an Axios instance configured with:

* `baseURL`: `import.meta.env.VITE_API_URL || "http://localhost:5000"`
* Default `timeout`: `30000` ms (`30s`)
* Vision inference `timeout` (`classifyImage`): `60000` ms (`60s`) to accommodate first-time `MobileNetV2` model loading on CPU

JSON payloads are sent for tabular/text/time-series endpoints, while `multipart/form-data` is used when uploading an image file to `/api/task03/classify`.

---

## PDF Viewer & Credential Cards (`Internship.jsx`)

`frontend/src/pages/Internship.jsx` embeds training documents stored in `frontend/public/`:

* **PDF Flipper Viewport (`Machine Learning-1.pdf`, `Presentation.pdf`, `Report-File.pdf`):** Uses an `<iframe>` driven by URL fragments (`#page=<page>&view=FitH&toolbar=1&navpanes=0`) with **Previous**, **Next**, direct **Page Number + Flip**, height presets (**`500PX`**, **`720PX`**, **`920PX`**), **Full Screen**, **Open PDF**, and **Download** controls.
* **Credential Cards:** Displays `/Offer-Letter.jpeg` and `/Certificate.jpeg` inside aspect-ratio-fitted containers without cropping text or seals.

> **Deployment Note:** Assets inside `frontend/public/` are served statically. Before deploying publicly, verify that `Offer-Letter.jpeg`, `Certificate.jpeg`, and public PDF copies only include details intended for public display.

---

## Setup & NPM Commands

### 1. Configure Environment

```bash
cd frontend
cp .env.example .env    # Windows: copy .env.example .env

```

Edit `.env` if needed:

```env
VITE_API_URL=http://localhost:5000

```

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build production bundle (outputs to frontend/dist/)
npm run build

# Preview production bundle locally
npm run preview

# Run ESLint
npm run lint

```

```

---

