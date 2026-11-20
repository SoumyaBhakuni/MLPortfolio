from flask import Blueprint, jsonify, request
from services.arima_service import forecast_arima
from utils.preprocessing import require_json_dict

arima_bp = Blueprint("arima_bp", __name__, url_prefix="/api/task09")


@arima_bp.route("/forecast", methods=["POST"])
def route_task09_forecast():
    try:
        body = require_json_dict(request.get_json(silent=True) or {})
        data = forecast_arima(
            steps=body.get("steps", 6),
            order=body.get("order"),
        )
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500