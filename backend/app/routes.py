from flask import Blueprint, jsonify

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/health')
def health_check():
    return jsonify({"success": True, "message": "Backend running!"})
