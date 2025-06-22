# Image Processing App

This is a full stack image processing app with a React frontend and a Python Flask backend. The backend uses Google Cloud Vision API to analyze uploaded images.

## How to Run

### Backend
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend
1. In the project root, run:
   ```
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Usage
- Upload an image using the frontend UI.
- The backend will analyze the image using Google Cloud Vision API and return the results.

## Configuration
- The Google API key is set in `backend/app.py`.

---
**Note:** Do not share your Google API key publicly.
