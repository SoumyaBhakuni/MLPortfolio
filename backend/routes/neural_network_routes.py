from flask import Blueprint, jsonify, request
from services.neural_network_service import predict_digit_canvas
from utils.preprocessing import require_json_dict

neural_network_bp = Blueprint("neural_network_bp", __name__, url_prefix="/api/task08")


@neural_network_bp.route("/predict", methods=["POST"])
def route_task08_predict():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        data = predict_digit_canvas(pixels=body.get("pixels"))
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500