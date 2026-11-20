import base64
from flask import Blueprint, jsonify, request
from services.image_service import classify_image_payload

image_bp = Blueprint("image_bp", __name__, url_prefix="/api/task03")


@image_bp.route("/classify", methods=["POST"])
def route_task03_classify():
    try:
        image_b64 = None
        filename = None

        if request.files and "file" in request.files:
            uploaded = request.files["file"]
            filename = uploaded.filename
            raw = uploaded.read()
            if not raw:
                return jsonify({"status": "error", "message": "Uploaded file is empty."}), 400
            image_b64 = base64.b64encode(raw).decode("utf-8")
        else:
            body = request.get_json(silent=True) or {}
            image_b64 = body.get("image_base64")
            filename = body.get("filename")

        data = classify_image_payload(image_b64=image_b64, filename=filename)
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500