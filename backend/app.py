from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import google.generativeai as genai
import json
import re

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = "AIzaSyCdF11Nw8u7eWTwDimxVoe0PVOBXm5jia4"
genai.configure(api_key=GOOGLE_API_KEY)

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    image_file = request.files['image']
    image_bytes = image_file.read()
    model = genai.GenerativeModel('gemini-1.5-flash')
    # Updated prompt for flexible card extraction
    prompt = (
        "You are a card reader. Extract all possible relevant fields from the card image, including but not limited to: Name, Title, Email, Phone Number, Address, Company Name, Website, Social Media, Logo (describe if present), QR Code (describe if present), and any other contact or identification information. "
        "Return the result as a JSON object with each detected field as a key and its value. If a field is missing, omit it. If you detect a logo or QR code, describe their location and content if possible."
    )
    try:
        response = model.generate_content([
            prompt,
            {"mime_type": image_file.mimetype, "data": image_bytes}
        ])
        # Try to extract JSON from the response
        text = response.text if hasattr(response, 'text') else str(response)
        # Find JSON in the response
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            card_data = json.loads(match.group(0))
            # Ensure main fields are always present and ordered
            main_fields = [
                "Name", "Title", "Company Name", "Phone Number", "Email", "Website"
            ]
            ordered = {field: card_data.get(field) for field in main_fields}
            # Add any extra fields at the end
            for k, v in card_data.items():
                if k not in ordered:
                    ordered[k] = v
            return jsonify(ordered)
        else:
            return jsonify({'raw_response': text, 'error': 'Could not extract JSON'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
