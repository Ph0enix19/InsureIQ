# InsureIQ

An AI-powered insurance claims processing assistant. It uses a custom Machine Learning pipeline to classify claim types and the Groq LLM (llama-3.3-70b-versatile) to extract structured entity information, analyze risk, and recommend next actions.

## Architecture

```text
+-------------------+        +---------------------+       +----------------------+
|                   |        |                     |       |                      |
|  React + Vite     |        | Node.js Gateway     |       | Groq LLM API         |
|  (Frontend UI)    |<------>| (Express Server)    |<----->| (Extract Details     |
|                   |        |                     |       |  & Risk Assessment)  |
+-------------------+        +----------+----------+       +----------------------+
                                        |
                                        V
                             +----------------------+
                             |                      |
                             | Python Flask ML API  |
                             | (Scikit-Learn NB)    |
                             +----------------------+
```

## Prerequisites
- Node.js (v18+)
- Python 3.10+
- A [Groq API Key](https://console.groq.com/keys) (Free)

## Setup & Running Locally

### 1. ML Service (Python)
Trains a TF-IDF + Naive Bayes classifier on 40 examples (Motor, Travel, Medical, Home) and serves it via Flask.

```bash
cd ml-service
# It is recommended to use a virtual environment
pip install -r requirements.txt
python train_model.py     # Generates claim_classifier.pkl
python app.py             # Runs on port 5000
```

### 2. Backend Server (Node.js)
Orchestrates requests between the ML service and Groq API.

```bash
cd server
npm install
```

Configure environment variables:
Create a `.env` file in the `server` directory and add:
```env
PORT=3000
ML_SERVICE_URL=http://localhost:5000
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```bash
npm start
```

### 3. Frontend Client (React + Vite)
```bash
cd client
npm install
npm run dev
```
Open the provided local URL (typically \`http://localhost:5173\`) in your browser.

## Deployment Targets
- **Frontend**: Deploy `client` folder to Vercel.
- **Backend**: Deploy `server` to Render as a Web Service. Ensure `GROQ_API_KEY` and Render-internal `ML_SERVICE_URL` are set.
- **ML Service**: Deploy `ml-service` to Render as a separate Web Service.
