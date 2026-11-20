from flask import Blueprint, jsonify, request
from services.naive_bayes_service import predict_spam_message
from utils.preprocessing import require_json_dict

naive_bayes_bp = Blueprint("naive_bayes_bp", __name__, url_prefix="/api/task06")


@naive_bayes_bp.route("/predict", methods=["POST"])
def route_task06_predict():
    try:
        body = require_json_dict(request.get_json(silent=True))
        if "message" not in body:
            return jsonify({"status": "error", "message": "Missing 'message'."}), 400
        data = predict_spam_message(body.get("message"))
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500