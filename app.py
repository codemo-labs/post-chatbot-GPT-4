from flask import Flask, request, jsonify, render_template, url_for
import openai
import os
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data['message']

    discussions = [
        {"role": "system", "content": "Anda adalah asisten yang sangat membantu."},
        {"role": "user", "content": message}
    ]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=discussions,        
        temperature=0,
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\n"]
    )

    response = completion.choices[0].message.content

    return jsonify({"message": response})


if __name__ == '__main__':
    app.run(debug=true)


