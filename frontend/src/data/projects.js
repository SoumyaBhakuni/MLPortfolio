export const ALLOWED_STATUSES = [
  'PLANNED',
  'IN DEVELOPMENT',
  'IMPLEMENTED',
  'TESTED',
  'INTEGRATED',
  'VERIFIED'
];

export const ML_LABS = [
  {
    id: '01',
    slug: 'eda',
    route: '/projects/eda',
    code: '01',
    title: 'EXPLORATORY_DATA_ANALYSIS',
    displayName: 'Exploratory Data Analysis',
    algorithm: 'Statistical Profiling & Multi-Variate EDA',
    category: 'Data Foundation',
    status: 'INTEGRATED',
    dataset: 'Iris Dataset (150 x 5, Real/Built-In)',
    folder: 'ml_projects/01_EDA',
    endpoint: '/api/task01/eda',
    accent: '#22D3EE',
    summary:
      'Profiles feature distributions, quartiles, correlations, and species separability across Setosa, Versicolor, and Virginica.',
    tags: ['Pandas', 'NumPy', 'Flask', 'Recharts/SVG'],
    metrics: [
      { label: 'Samples', value: '150' },
      { label: 'Features', value: '4' },
      { label: 'Nulls', value: '0' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '02',
    slug: 'linear-regression',
    route: '/projects/linear-regression',
    code: '02',
    title: 'LINEAR_REGRESSION',
    displayName: 'Linear Regression',
    algorithm: 'Ordinary Least Squares Linear Regression',
    category: 'Supervised',
    status: 'IMPLEMENTED',
    dataset: 'Synthetic Housing Dataset (150 Rows, Synthetic Demo)',
    folder: 'ml_projects/02_Linear_Regression',
    endpoint: '/api/task02/predict',
    accent: '#10B981',
    summary:
      'Fits an OLS regression line on generated housing data (area_sqft -> price_usd) with MSE, RMSE, MAE, and R2 evaluation.',
    tags: ['Scikit-Learn', 'Joblib', 'NumPy', 'Synthetic'],
    metrics: [
      { label: 'Model', value: 'OLS' },
      { label: 'Predictor', value: 'area_sqft' },
      { label: 'Target', value: 'price_usd' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '03',
    slug: 'image-classification',
    route: '/projects/image-classification',
    code: '03',
    title: 'IMAGE_CLASSIFICATION',
    displayName: 'Image Classification Lab',
    algorithm: 'MobileNetV2 (ImageNet) + Labelled Test Set',
    category: 'Deep Learning',
    status: 'IMPLEMENTED',
    dataset: 'Labelled Test Images & Uploaded RGB Images (224x224)',
    folder: 'ml_projects/03_Image_Classification',
    endpoint: '/api/task03/classify',
    accent: '#F59E0B',
    summary:
      'Validates and resizes images to 224x224x3 for MobileNetV2 top-5 predictions, true vs. predicted label checks, and confusion matrix evaluation.',
    tags: ['MobileNetV2', 'Pillow', 'NumPy'],
    metrics: [
      { label: 'Input', value: '224x224x3' },
      { label: 'Top-K', value: 'Top 5' },
      { label: 'Eval', value: 'True/Pred' }
    ],
    chartType: 'bar-metrics'
  },
  {
    id: '04',
    slug: 'kmeans',
    route: '/projects/kmeans',
    code: '04',
    title: 'KMEANS_CLUSTERING',
    displayName: 'K-Means Clustering',
    algorithm: 'Standardized K-Means & Elbow Inertia',
    category: 'Unsupervised',
    status: 'IMPLEMENTED',
    dataset: 'Synthetic Customer Data (125 Rows, Synthetic Demo)',
    folder: 'ml_projects/04_KMeans_Clustering',
    endpoint: '/api/task04/cluster',
    accent: '#A855F7',
    summary:
      'Standardizes customer income and spending attributes, computes elbow inertias, and assigns clusters with explicit synthetic data disclosure.',
    tags: ['Scikit-Learn', 'StandardScaler', 'Pandas', 'Synthetic'],
    metrics: [
      { label: 'Rows', value: '125' },
      { label: 'Scaling', value: 'Standard' },
      { label: 'Elbow', value: 'K=1..8' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '05',
    slug: 'decision-tree',
    route: '/projects/decision-tree',
    code: '05',
    title: 'DECISION_TREE',
    displayName: 'Decision Tree Classifier',
    algorithm: 'CART Decision Tree with Max Depth Control',
    category: 'Supervised',
    status: 'IMPLEMENTED',
    dataset: 'Iris Dataset (150 x 4, Real/Built-In)',
    folder: 'ml_projects/05_Decision_Tree',
    endpoint: '/api/task05/predict',
    accent: '#22D3EE',
    summary:
      'Trains a decision tree classifier with adjustable max_depth, returns weighted metrics, rules, and class probabilities.',
    tags: ['Scikit-Learn', 'DecisionTree', 'Joblib'],
    metrics: [
      { label: 'Classes', value: '3 Iris' },
      { label: 'Depth', value: '1 - 12' },
      { label: 'Metrics', value: 'Acc / F1' }
    ],
    chartType: 'bar-metrics'
  },
  {
    id: '06',
    slug: 'naive-bayes',
    route: '/projects/naive-bayes',
    code: '06',
    title: 'NAIVE_BAYES',
    displayName: 'Naive Bayes Text Classification',
    algorithm: 'Multinomial Naive Bayes + TF-IDF',
    category: 'Supervised',
    status: 'IMPLEMENTED',
    dataset: 'SMS Spam Collection (5,574 Rows, Public Dataset)',
    folder: 'ml_projects/06_Naive_Bayes',
    endpoint: '/api/task06/predict',
    accent: '#10B981',
    summary:
      'Normalizes text, vectorizes tokens via TF-IDF, and classifies SMS messages as Spam or Ham with precision, recall, and F1 metrics.',
    tags: ['MultinomialNB', 'TF-IDF', 'NLP'],
    metrics: [
      { label: 'Messages', value: '5,574' },
      { label: 'Classes', value: 'Spam/Ham' },
      { label: 'Model', value: 'Multinomial' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '07',
    slug: 'pca',
    route: '/projects/pca',
    code: '07',
    title: 'PRINCIPAL_COMPONENT_ANALYSIS',
    displayName: 'Principal Component Analysis',
    algorithm: 'Standardized PCA & Variance Projection',
    category: 'Unsupervised',
    status: 'IMPLEMENTED',
    dataset: 'Iris Dataset (4D -> kD, Real/Built-In)',
    folder: 'ml_projects/07_PCA',
    endpoint: '/api/task07/transform',
    accent: '#F59E0B',
    summary:
      'Projects standardized 4D Iris features onto 1 to 4 principal components with explained and cumulative variance.',
    tags: ['Scikit-Learn', 'PCA', 'StandardScaler'],
    metrics: [
      { label: 'Input Dim', value: '4D' },
      { label: 'Components', value: '1 - 4' },
      { label: 'Output', value: 'PC1..PCk' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '08',
    slug: 'neural-network',
    route: '/projects/neural-network',
    code: '08',
    title: 'NEURAL_NETWORK',
    displayName: 'Neural Network Digit Recognizer',
    algorithm: 'Multi-Layer Perceptron (Cached Joblib Model)',
    category: 'Deep Learning',
    status: 'IMPLEMENTED',
    dataset: 'Scikit-Learn 8x8 Digits Dataset (1,797 Samples)',
    folder: 'ml_projects/08_Neural_Network',
    endpoint: '/api/task08/predict',
    accent: '#A855F7',
    summary:
      'Loads cached digits_mlp.joblib on the 8x8 scikit-learn Digits dataset and predicts digits 0-9 with softmax probabilities.',
    tags: ['MLPClassifier', '8x8 Digits', 'Joblib'],
    metrics: [
      { label: 'Digits', value: '0 - 9' },
      { label: 'Grid', value: '8x8 (64)' },
      { label: 'Cache', value: 'Joblib' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '09',
    slug: 'arima',
    route: '/projects/arima',
    code: '09',
    title: 'ARIMA_FORECASTING',
    displayName: 'ARIMA Time-Series Forecasting',
    algorithm: 'ARIMA (p, d, q) with ADF Stationarity Check',
    category: 'Time Series',
    status: 'IMPLEMENTED',
    dataset: 'Monthly Sales CSV (36 Periods, Synthetic Demo)',
    folder: 'ml_projects/09_ARIMA',
    endpoint: '/api/task09/forecast',
    accent: '#22D3EE',
    summary:
      'Reads monthly_sales.csv, runs ADF stationarity checks, separates train/test validation from future forecasts, and reports AIC, MAE, and RMSE.',
    tags: ['Statsmodels', 'ARIMA', 'ADF', 'Synthetic'],
    metrics: [
      { label: 'Periods', value: '36' },
      { label: 'Default', value: '(1,1,1)' },
      { label: 'Checks', value: 'ADF/AIC' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '10',
    slug: 'svm',
    route: '/projects/svm',
    code: '10',
    title: 'SUPPORT_VECTOR_MACHINE',
    displayName: 'Support Vector Machine',
    algorithm: 'Binary SVC (Setosa vs Versicolor)',
    category: 'Supervised',
    status: 'IMPLEMENTED',
    dataset: 'Iris Dataset (Two Species, Real/Built-In)',
    folder: 'ml_projects/10_SVM',
    endpoint: '/api/task10/predict',
    accent: '#10B981',
    summary:
      'Trains a binary SVM on Setosa and Versicolor with configurable kernel, C, and gamma plus support vector counts.',
    tags: ['Scikit-Learn', 'SVC', 'StandardScaler'],
    metrics: [
      { label: 'Kernels', value: 'Linear/RBF' },
      { label: 'Classes', value: '2 Iris' },
      { label: 'Params', value: 'C & Gamma' }
    ],
    chartType: 'scatter-iris'
  }
];

export const SKILL_GROUPS = [
  {
    title: 'MACHINE_LEARNING & DL',
    accent: '#22D3EE',
    items: ['Scikit-Learn', 'Statsmodels', 'Regression & SVM', 'Decision Trees', 'PCA & K-Means', 'MLP & Vision']
  },
  {
    title: 'DATA & VISUALIZATION',
    accent: '#10B981',
    items: ['Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Statistical EDA']
  },
  {
    title: 'FULL-STACK & TOOLING',
    accent: '#F59E0B',
    items: ['Python 3', 'Flask + Gunicorn', 'React + Vite', 'Tailwind CSS', 'Git & GitHub', 'LaTeX Report']
  }
];