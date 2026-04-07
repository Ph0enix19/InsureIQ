import os
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import train_model

app = Flask(__name__)
CORS(app)

model_path = os.path.join(os.path.dirname(__file__), 'claim_classifier.pkl')

def get_model():
    if not os.path.exists(model_path):
        print("Model not found. Training...")
        train_model.train()
    return joblib.load(model_path)

classifier = get_model()

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    claim_text = data.get('text', '')
    
    if not claim_text:
        return jsonify({"error": "No text provided"}), 400
        
    try:
        prediction = classifier.predict([claim_text])[0]
        probabilities = classifier.predict_proba([claim_text])[0]
        confidence = max(probabilities)
        
        return jsonify({
            "claim_type": prediction,
            "confidence": round(confidence, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
