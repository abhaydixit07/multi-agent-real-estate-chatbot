import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
from dotenv import load_dotenv
from io import BytesIO
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://multi-agent-real-estate-chatbot.vercel.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Model configuration with system instruction
system_instruction = """You are a Tenancy FAQ Assistant for a real estate chatbot system. Your only purpose is to answer tenancy-related questions. Stay strictly within this role and never switch to property inspection or image analysis tasks.

Rules:
- Only respond to tenancy, rental, landlord, or tenant questions.
- Provide clear, jurisdiction-specific answers.
- If a user's message is unclear, ask a clarifying question.
- Always stay in character and never break role.

Example:
User: “Can my landlord evict me without notice?”
You: “In most jurisdictions, landlords must give written notice before eviction unless there's illegal activity.”

Do NOT refer to yourself as an AI. Never reject valid tenancy queries within your scope."""


model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    },
    system_instruction=system_instruction
)

def create_chat_session(history):
    """Create a chat session with formatted history"""
    formatted_history = []
    for item in history:
        formatted_history.append({
            "role": item["role"],
            "parts": [item["content"]]
        })
    return model.start_chat(history=formatted_history)

@app.route("/api/agent2", methods=["POST"])
def agent2_handler():
    try:
        # Get and validate request data
        data = request.get_json()
        print(f"Received request data: {data}")
        
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        user_input = data.get("query", "").strip()
        location = data.get("location", "").strip()
        history = data.get("history", [])
        
        print(f"Processing - Input: '{user_input}', Location: '{location}'")
        
        if not user_input:
            return jsonify({"error": "Query is required"}), 400

        # Create prompt
        prompt = f"Question: {user_input}"
        
        # Create chat session
        chat_session = create_chat_session(history)
        print("Chat session created successfully")
        
        # Get response - no system_instruction here, it's already set in the model
        response = chat_session.send_message(prompt)
        print("Response generated successfully")
        
        # Update history
        new_history = history + [
            {"role": "user", "content": user_input},
            {"role": "model", "content": response.text}
        ]
        
        return jsonify({
            "response": response.text,
            "history": new_history
        })

    except Exception as e:
        print(f"Error in agent2_handler: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
    


@app.route("/api/agent1", methods=["POST"])
def agent1_handler():
    try:
        # Get form data
        user_text = request.form.get("text", "").strip()
        image_file = request.files.get("image", None)
        history = json.loads(request.form.get("history", "[]"))
        
        # Prepare chat history
        gemini_history = []
        for item in history:
            gemini_history.append({
                "role": item["role"],
                "parts": [{"text": item["content"]}]
            })
        system_instruction="""You are a Property Issue Detection & Troubleshooting expert in a real estate chatbot. Your job is to detect visible property issues based on user-uploaded images and optional text descriptions.

Responsibilities:
- Analyze uploaded images to identify common property problems (e.g., mold, cracks, leaks, broken fixtures).
- Provide actionable troubleshooting advice (e.g., call a plumber, use anti-damp paint).
- Ask follow-up questions if more context is needed.

Example:
User: “What's wrong with this wall?” (image attached)
You: “It appears there's mold due to water seepage. Use a dehumidifier and check for plumbing leaks.”

Always stay in role. Do NOT break character or refer to yourself as an AI."""

        # Create model with system instruction
        property_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
                "response_mime_type": "text/plain",
            },
            system_instruction=system_instruction
        )

        # Start chat session
        chat_session = property_model.start_chat(history=gemini_history)

        # Handle image if provided
        if image_file:
            # Get image as bytes
            image_bytes = image_file.read()
            
            # Create in-memory file object following the reference code pattern
            image_data = {
                "mime_type": image_file.content_type or "image/png",
                "data": image_bytes
            }
            
            # Prepare message content
            if user_text:
                response = chat_session.send_message(
                    [user_text, image_data]
                )
            else:
                response = chat_session.send_message(image_data)
        else:
            # Text-only message
            response = chat_session.send_message(
                user_text or "Please describe the property issue."
            )

        # Update history
        new_history = history + [
            {"role": "user", "content": user_text or "Image uploaded"},
            {"role": "model", "content": response.text}
        ]

        return jsonify({
            "response": response.text,
            "history": new_history
        })

    except Exception as e:
        print(f"Error in agent1_handler: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)