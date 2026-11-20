import os
import sys
from flask import Blueprint, jsonify

EDA_SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "ml_projects", "01_EDA")
)
if EDA_SRC_DIR not in sys.path:
    sys.path.insert(0, EDA_SRC_DIR)

from eda import get_eda_payload  # noqa: E402

eda_bp = Blueprint("eda_bp", __name__, url_prefix="/api/task01")


@eda_bp.route("/eda", methods=["GET"])
def task01_eda():
    try:
        payload = get_eda_payload()
        return jsonify({"status": "ok", "data": payload}), 200
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500