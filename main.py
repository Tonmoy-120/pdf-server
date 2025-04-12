import os
import base64
from dotenv import load_dotenv

from flask import Flask, send_file, render_template, request, jsonify

app = Flask(__name__)

load_dotenv()
SAVE_PATH = os.getenv("SAVE_PATH")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/list")
def list():
    return render_template("list.html")

@app.route("/upload", methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'message': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        if file:
            filename = file.filename
            filepath = os.path.join(SAVE_PATH, filename)
            try:
                file.save(filepath)
                return jsonify({'message': 'File uploaded successfully'}), 200
            except Exception as e:
                print(f"Error saving file: {e}")
                return jsonify({'message': 'Failed to save file'}), 500
    return render_template("upload.html")


@app.route("/upload-url", methods=['GET', 'POST'])
def upload_url():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'message': 'No text provided'}), 400

        text_input = data['text'].strip()
        if not text_input:
            return jsonify({'message': 'Empty input'}), 400

        # Validate URL for PDF
        if text_input.startswith("http://") or text_input.startswith("https://"):
            if not is_valid_url(text_input):
                return jsonify({'message': 'Invalid URL format'}), 400

            try:
                response = requests.get(text_input)
                if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
                    filename = os.path.basename(text_input.split('?')[0])
                    if not filename.endswith('.pdf'):
                        filename += '.pdf'
                    filepath = os.path.join(SAVE_PATH, filename)
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    return jsonify({'message': 'PDF downloaded successfully'}), 200
                else:
                    return jsonify({'message': 'URL did not return a valid PDF'}), 400
            except Exception as e:
                print(f"Error downloading PDF: {e}")
                return jsonify({'message': 'Failed to download PDF'}), 500
        else:
            return jsonify({'message': 'Only PDF URLs are allowed'}), 400

    return render_template("upload_url.html")

def is_valid_url(url):
    try:
        result = requests.head(url, allow_redirects=True)  # Use HEAD to minimize data load
        return result.status_code == 200
    except requests.RequestException:
        return False


@app.route("/get_pdfs", methods=['GET'])
def get_pdfs():
    page = int(request.args.get("page", 1))
    per_page = 50
    all_files = all_files = [f for f in os.listdir(SAVE_PATH) if f.endswith(".pdf")] # test-> [f"{i}.pdf" for i in range(1, 501)]
    total_files = len(all_files)
    paginated_files = all_files[(page - 1) * per_page: page * per_page]
    file_list = [{"name": f, "url": f"/view/{f}"} for f in paginated_files]
    return jsonify({"files": file_list, "has_more": (page * per_page) < total_files})

@app.route("/view/<filename>")
def view_pdf(filename):
    user_agent = request.headers.get('User-Agent')
    filepath = os.path.join(SAVE_PATH, filename)
    if 'Android' not in user_agent:
        return send_file(filepath, mimetype="application/pdf")
    try:
        with open(filepath, "rb") as f:
            pdf_content = f.read()
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        return render_template("view_pdf.html", pdf_base64=pdf_base64)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def main():
    app.run(port=int(os.environ.get('PORT', 80)), debug=True)
if __name__ == "__main__":
    main()
