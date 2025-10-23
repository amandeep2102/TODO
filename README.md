# Flask To-Do App

A simple Flask-based web application to manage your to-dos.  
The app uses **Flask** for the backend and **Jinja2** for templating.

---

## Project Structure

```
TODO/
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
├── app.py
└── todos.json     # Automatically created when the app runs
```

---

## Installation & Setup

### 1. Clone or download this repository
```bash
git clone https://github.com/amandeep2102/TODO.git
cd TODO
```

### 2. Create and activate a virtual environment *(optional but recommended)*
```bash
python -m venv Todo
source Todo/bin/activate      
```

### 3. Install dependencies
```bash
pip install flask jinja2
```

---

## Running the Application

Run the Flask app:
```bash
python app.py
```

By default, Flask runs on:
```
http://127.0.0.1:5000/
```

Open this URL in your browser to view the app.

---
