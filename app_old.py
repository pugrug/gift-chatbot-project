from flask import Flask, request, jsonify
   from flask_cors import CORS
   import openai
   import os
   from dotenv import load_dotenv

   load_dotenv()

   app = Flask(__name__)
   CORS(app)

   openai.api_key = os.getenv('OPENAI_API_KEY')

   @app.route('/chat', methods=['POST'])
   def chat():
       data = request.json
       user_message = data.get('message')
       
       if not user_message:
           return jsonify({"error": "No message provided"}), 400
       
       try:
           response = openai.ChatCompletion.create(
               model="gpt-3.5-turbo",
               messages=[
                   {"role": "system", "content": "You are a helpful gift recommendation assistant."},
                   {"role": "user", "content": user_message}
               ]
           )
           ai_response = response.choices[0].message['content']
           return jsonify({"response": ai_response})
       except openai.error.RateLimitError:
           return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429
       except openai.error.AuthenticationError:
           return jsonify({"error": "Authentication error. Please check your API key."}), 401
       except Exception as e:
           return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

   if __name__ == '__main__':
       app.run(debug=True, port=5001)