from flask import Blueprint, request, jsonify

bp = Blueprint('routes', __name__)

# Ayurvedic recommendations
dosha_data = {
    "vata": ["Warm soups", "Cooked grains", "Sweet fruits", "Avoid cold food"],
    "pitta": ["Coconut water", "Cucumber", "Milk", "Avoid spicy food"],
    "kapha": ["Light soups", "Ginger tea", "Steamed vegetables", "Avoid fried food"]
}

@bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    dosha = data.get("dosha", "").lower()
    goal = data.get("goal", "").lower()

    recs = dosha_data.get(dosha, ["Invalid dosha (vata/pitta/kapha)"])
    response = {"dosha": dosha, "goal": goal, "recommendations": recs}
    return jsonify(response)

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message", "").lower()

    if "hello" in message:
        reply = "Namaste! How are you feeling today?"
    elif "diet" in message:
        reply = "Please tell me your dosha — Vata, Pitta, or Kapha — so I can suggest foods."
    elif "thank" in message:
        reply = "You're welcome! Stay healthy 🌿"
    else:
        reply = "I can help with Ayurvedic diets. Try asking 'What should a Pitta person eat?'"

    return jsonify({"reply": reply})
