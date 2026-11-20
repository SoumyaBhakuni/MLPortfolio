from .arima_routes import arima_bp
from .clustering_routes import clustering_bp
from .decision_tree_routes import decision_tree_bp
from .eda_routes import eda_bp
from .image_routes import image_bp
from .naive_bayes_routes import naive_bayes_bp
from .neural_network_routes import neural_network_bp
from .pca_routes import pca_bp
from .regression_routes import regression_bp
from .svm_routes import svm_bp

ALL_BLUEPRINTS = [
    eda_bp,
    regression_bp,
    image_bp,
    clustering_bp,
    decision_tree_bp,
    naive_bayes_bp,
    pca_bp,
    neural_network_bp,
    arima_bp,
    svm_bp,
]

__all__ = ["ALL_BLUEPRINTS"]