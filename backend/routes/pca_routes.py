from flask import Blueprint, jsonify, request
from services.pca_service import transform_pca
from utils.preprocessing import require_json_dict

pca_bp = Blueprint("pca_bp", __name__, url_prefix="/api/task07")


@pca_bp.route("/transform", methods=["POST"])
def route_task07_transform():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        data = transform_pca(n_components=body.get("n_components", 2))
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500