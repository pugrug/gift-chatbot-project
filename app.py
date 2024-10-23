from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        # Get data from request
        data = request.json
        recipient_info = data.get('recipientInfo', '')
        
        # Construct the prompt for OpenAI
        prompt = f"""You are a helpful gift recommendation assistant. Please suggest 3 thoughtful gift ideas for someone with the following information:
        
        {recipient_info}
        
        For each gift suggestion, provide:
        1. The name of the gift
        2. Estimated price range
        3. Why it would be a good fit
        4. Where to buy it
        
        Keep each suggestion concise but informative."""

        # Call OpenAI API with new format
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful gift recommendation assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        # Extract the recommendations from the response (new format)
        recommendations = response.choices[0].message.content

        return jsonify({
            "success": True,
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Gift recommendation service is running"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)