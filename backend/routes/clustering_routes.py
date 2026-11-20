from flask import Blueprint, jsonify, request
from services.clustering_service import run_kmeans_clustering
from utils.preprocessing import require_json_dict

clustering_bp = Blueprint("clustering_bp", __name__, url_prefix="/api/task04")


@clustering_bp.route("/cluster", methods=["POST"])
def route_task04_cluster():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        n_clusters = body.get("n_clusters", 5)
        data = run_kmeans_clustering(n_clusters=n_clusters)
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500