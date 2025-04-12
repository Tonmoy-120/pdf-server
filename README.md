# 📚 Personal Archive (Flask)

![Flask](https://img.shields.io/badge/Flask-Framework-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

This is my personal web app built with **Flask** to host and read PDF files directly in your browser. It's designed for easy access from any device, anywhere, with no need for third-party apps.

---

## 📸 Demo

> Coming soon!

Or run locally using the steps below.


## 🚀 Features

- 📄 Upload and manage PDF files
- 🌐 View PDFs directly in your browser
- 📱 Responsive design – works on mobile, tablet, and desktop
- 🧩 No database required – files stored locally
- 🛡️ Can be self-hosted securely on your own server
- 💻 Cross-platform – works on Windows, Linux, macOS

## 🚀 Getting Started

To get started, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-archive.git
cd personal-archive
```

### 2. Install Dependencies
Make sure you have Python 3.7+ installed.

```bash
pip install -r requirements.txt

```

### 3. Run the App
```bash
flask run
```

Go to `http://localhost:5000` in your browser.

## ⚙️ Configuration

You can set these environment variables:

| Variable       | Description                  | Default           |
|----------------|------------------------------|-------------------|
| `SAVE_PATH`    | Path to store uploaded files | `static/uploads`  |
| `SECRET_KEY`   | Flask secret key             | `"your-secret"`   |

Use a `.env` file or set them in your system environment.

## 🤝 Contributing
Pull requests and feedback are welcome! Open an issue or fork and submit a PR.


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
