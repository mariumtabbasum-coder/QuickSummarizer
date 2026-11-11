# QuickSummarizer

QuickSummarizer is a responsive AI-powered text summarization web app. Paste long text and generate a short summary, detailed summary, bullet points, important keywords, and key takeaways using the Gemini API.

## Features

- Short, medium, and long summary-length guidance
- Short summary and detailed summary
- Bullet-point summary
- Important keywords
- Key takeaways
- Live word and character counter
- Copy each section or copy all results
- Sample text and clear-text actions
- Loading indicator and helpful error messages
- Responsive layout for desktop, tablet, and mobile
- Flask backend with Gemini API integration

## Tech stack

- Frontend: HTML5, CSS3, Bootstrap 5, JavaScript
- Backend: Python, Flask
- AI: Gemini API (`google-genai`)
- Configuration: `python-dotenv`

## Project structure

```text
QuickSummarizer/
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## Setup on Windows (PowerShell)

### 1. Open the project folder

```powershell
cd path\to\QuickSummarizer
```

### 2. Create and activate a virtual environment

Use Python 3.12 if it is installed:

```powershell
py -3.12 --version
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run this for the current terminal only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Add your Gemini API key

Copy `.env.example` and rename the copy to `.env`:

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace `your_gemini_api_key_here` with your own Gemini API key. Create a key in [Google AI Studio](https://aistudio.google.com/apikey).

**Never upload `.env` or share your API key on GitHub.** The `.gitignore` file already excludes `.env`.

### 5. Run the app

```powershell
python app.py
```

Open this address in your browser:

```text
http://127.0.0.1:5000
```

## How it works

1. The browser sends the pasted text and selected length to Flask.
2. Flask validates the input and builds a prompt.
3. The Gemini API generates a structured JSON response.
4. Flask validates the response and returns it to the frontend.
5. JavaScript renders the five result sections and enables copy actions.

## Concepts to learn

- **LLM API:** Your Flask backend sends a prompt to Gemini and receives generated content.
- **Prompt engineering:** The prompt defines the role, output structure, constraints, and summary-length guidance.
- **Tokens:** Models process text as tokens (small text units), not simply as words. Longer input generally uses more tokens.
- **Context window:** The model's context window is the amount of input and output it can process in one request. Very long text may exceed the model's available context or API limits.
- **JSON response handling:** The backend requests JSON, parses it, checks the required keys, and sends predictable data to the browser.

## Important notes

- The app currently limits request text to 2 MB at the Flask level. This is not a guarantee that every text of that size fits the model's token/context limits.
- API availability, model names, quotas, and pricing can change. Check the current Gemini API documentation if a model is unavailable.
- Always verify AI summaries against the original text, especially for high-stakes material.

## Before publishing to GitHub

- [ ] Test with your own Gemini API key.
- [ ] Test empty, short, and long input.
- [ ] Test on mobile, tablet, and desktop widths.
- [ ] Take screenshots of the input screen and generated results.
- [ ] Record a short demo video.
- [ ] Confirm `.env` is not staged or committed.
- [ ] Add your GitHub repository URL here after publishing.

## Future improvements

- Download summary as TXT or PDF
- Preserve previous summaries in a local history
- Add language selection
- Add file upload for TXT and PDF documents
- Add token estimation and input-length guidance
