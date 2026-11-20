from flask import Blueprint, jsonify, request
from services.svm_service import predict_svm
from utils.preprocessing import require_json_dict

svm_bp = Blueprint("svm_bp", __name__, url_prefix="/api/task10")


@svm_bp.route("/predict", methods=["POST"])
def route_task10_predict():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        data = predict_svm(
            features=body.get("features"),
            kernel=body.get("kernel", "rbf"),
            c_value=body.get("C", body.get("c_value", 1.0)),
            gamma=body.get("gamma", "scale"),
        )
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500