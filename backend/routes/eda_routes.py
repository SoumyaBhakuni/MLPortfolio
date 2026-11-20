from flask import Blueprint, jsonify, request
from services.eda_service import get_eda_report, get_scatter_data

eda_bp = Blueprint("eda_bp", __name__, url_prefix="/api/task01")


@eda_bp.route("/eda", methods=["GET"])
def route_task01_eda():
    try:
        export = request.args.get("export", "false").lower() == "true"
        data = get_eda_report(export_stats=export)
        return jsonify({"status": "success", "data": data}), 200
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500


@eda_bp.route("/scatter", methods=["GET"])
def route_task01_scatter():
    x_col = request.args.get("x", "sepal length (cm)")
    y_col = request.args.get("y", "petal length (cm)")
    try:
        data = get_scatter_data(x_col=x_col, y_col=y_col)
        return jsonify({"status": "success", "data": data}), 200
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500