from flask import Blueprint, jsonify, request
from services.decision_tree_service import predict_decision_tree
from utils.preprocessing import require_json_dict

decision_tree_bp = Blueprint("decision_tree_bp", __name__, url_prefix="/api/task05")


@decision_tree_bp.route("/predict", methods=["POST"])
def route_task05_predict():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        data = predict_decision_tree(
            features=body.get("features"),
            max_depth=body.get("max_depth", 3),
        )
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500