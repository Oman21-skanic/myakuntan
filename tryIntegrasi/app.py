from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load 
with open('./model_prediksi_laba.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_data = np.array(data['features']).reshape(1, -1)
        

        expected_features = model.n_features_in_
        if input_data.shape[1] != expected_features:
            return jsonify({"error": f"Invalid input: expected {expected_features} features, got {input_data.shape[1]}"}), 400
        
        prediction = model.predict(input_data)[0]
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
