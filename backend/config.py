import os


class Config:
    """Central configuration for ML Portfolio Backend."""

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
    ML_PROJECTS_DIR = os.path.join(PROJECT_ROOT, "ml_projects")
    MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", "5000"))
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000",
        ).split(",")
        if origin.strip()
    ]

    ALLOWED_STATUSES = {
        "PLANNED",
        "IN DEVELOPMENT",
        "IMPLEMENTED",
        "TESTED",
        "INTEGRATED",
    }

    TASKS_CATALOG = [
        {
            "id": "01",
            "slug": "eda",
            "folder": "01_EDA",
            "title": "Exploratory Data Analysis",
            "algorithm": "Statistical Profiling & Visual EDA",
            "dataset": "Iris Flower Dataset",
            "endpoint": "/api/task01/eda",
            "status": "IMPLEMENTED",
        },
        {
            "id": "02",
            "slug": "linear-regression",
            "folder": "02_Linear_Regression",
            "title": "Simple Linear Regression",
            "algorithm": "Ordinary Least Squares Linear Regression",
            "dataset": "Housing Price Dataset",
            "endpoint": "/api/task02/predict",
            "status": "IMPLEMENTED",
        },
        {
            "id": "03",
            "slug": "image-classification",
            "folder": "03_Image_Classification",
            "title": "Image Classification",
            "algorithm": "MobileNetV2 / CNN Classifier",
            "dataset": "ImageNet / Sample Test Images",
            "endpoint": "/api/task03/classify",
            "status": "IMPLEMENTED",
        },
        {
            "id": "04",
            "slug": "kmeans",
            "folder": "04_KMeans_Clustering",
            "title": "K-Means Clustering",
            "algorithm": "K-Means Clustering",
            "dataset": "Customer Segmentation Dataset",
            "endpoint": "/api/task04/cluster",
            "status": "IMPLEMENTED",
        },
        {
            "id": "05",
            "slug": "decision-tree",
            "folder": "05_Decision_Tree",
            "title": "Decision Tree Classifier",
            "algorithm": "Decision Tree Classifier",
            "dataset": "Iris Flower Dataset",
            "endpoint": "/api/task05/predict",
            "status": "IMPLEMENTED",
        },
        {
            "id": "06",
            "slug": "naive-bayes",
            "folder": "06_Naive_Bayes",
            "title": "Naive Bayes Text Classification",
            "algorithm": "Multinomial Naive Bayes + TF-IDF",
            "dataset": "SMS Spam Collection",
            "endpoint": "/api/task06/predict",
            "status": "IMPLEMENTED",
        },
        {
            "id": "07",
            "slug": "pca",
            "folder": "07_PCA",
            "title": "Principal Component Analysis",
            "algorithm": "PCA Dimensionality Reduction",
            "dataset": "Iris Flower Dataset",
            "endpoint": "/api/task07/transform",
            "status": "IMPLEMENTED",
        },
        {
            "id": "08",
            "slug": "neural-network",
            "folder": "08_Neural_Network",
            "title": "Artificial Neural Network",
            "algorithm": "Multi-Layer Perceptron (ReLU / Softmax)",
            "dataset": "MNIST Handwritten Digits",
            "endpoint": "/api/task08/predict",
            "status": "IMPLEMENTED",
        },
        {
            "id": "09",
            "slug": "arima",
            "folder": "09_ARIMA",
            "title": "ARIMA Time-Series Forecasting",
            "algorithm": "ARIMA (p, d, q)",
            "dataset": "Monthly Series Dataset",
            "endpoint": "/api/task09/forecast",
            "status": "IMPLEMENTED",
        },
        {
            "id": "10",
            "slug": "svm",
            "folder": "10_SVM",
            "title": "Support Vector Machine",
            "algorithm": "SVM (Linear / RBF Kernel)",
            "dataset": "Iris Dataset (Binary Species)",
            "endpoint": "/api/task10/predict",
            "status": "IMPLEMENTED",
        },
    ]