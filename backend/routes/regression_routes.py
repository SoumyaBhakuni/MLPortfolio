from flask import Blueprint, jsonify, request
from services.regression_service import predict_linear_regression
from utils.preprocessing import require_json_dict

regression_bp = Blueprint("regression_bp", __name__, url_prefix="/api/task02")


@regression_bp.route("/predict", methods=["POST"])
def route_task02_predict():
    try:
        body = require_json_dict(request.get_json(silent=True))
        if "area_sqft" not in body:
            return jsonify({"status": "error", "message": "Missing 'area_sqft'."}), 400
        data = predict_linear_regression(body.get("area_sqft"))
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500