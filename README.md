# Quizify - Interactive Learning Platform

Quizify is a modern web-based learning platform that offers interactive quizzes, notes generation, and AI-powered learning assistance. The platform is designed to help students and learners master various subjects through engaging content and personalized learning experiences.

## Features

### 1. User Authentication

- Secure signup and login system with JWT tokens
- Automatic token refresh
- Protected routes for authenticated users

### 2. Interactive Quizzes

- AI-powered quiz generation on any topic
- Multiple subject categories:
  - Coding (Python, JavaScript, Java)
  - Mathematics (Calculus, Linear Algebra, Statistics)
  - Physics (Mechanics, Electromagnetism, Thermodynamics)
- Real-time scoring
- Progress tracking
- Leaderboard system

### 3. Notes

- AI-powered notes generation
- Subject-specific formatting
- Personal notes library

### 4. AI Assistant

- Interactive chatbot for learning assistance
- Context-aware responses
- Available across the platform
- Powered by Gemini AI service

### 5. User Interface

- Modern, responsive design with Tailwind CSS
- Toast notifications system
- Smooth animations and transitions
- Clean, minimalist UI

## Technology Stack

### Frontend

- React 18
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Zustand (state management)
- Axios (HTTP client)
- React Hot Toast
- React Markdown
- Lucide React (icons)

### Backend

- FastAPI (Python)
- SQLAlchemy ORM
- SQLite Database
- JWT Authentication (python-jose)
- Passlib (password hashing)
- Pydantic (data validation)
- HTTPX (async HTTP client)

### AI Integration

- Google Gemini AI API
- Quiz generation
- Notes generation
- Interactive chatbot

## Installation

### Option 1: Docker (Recommended)

1. Prerequisites:

   ```
   - Docker Desktop
   - Git
   ```

2. Setup:

   ```bash
   # Clone the repository
   git clone [repository-url] Quizify
   cd Quizify

   # Create .env file from example
   cp .env.example .env

   # Edit .env and add your GEMINI_API_KEY

   # Start with Docker Compose
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. Prerequisites:

   ```
   - Python 3.11+
   - pip
   ```

2. Setup:

   ```bash
   cd backend

   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Set environment variables (or create .env file)
   export DATABASE_URL=sqlite:///./quizify.db
   export SECRET_KEY=your-secret-key
   export GEMINI_API_KEY=your-gemini-api-key

   # Run the server
   uvicorn app.main:app --reload
   ```

#### Frontend Setup

1. Prerequisites:

   ```
   - Node.js 18+
   - npm
   ```

2. Setup:

   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Set environment variables (or create .env file)
   # VITE_API_URL=http://localhost:8000

   # Run the development server
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Project Structure

```
Quizify Web Project/
├── auth/                  # Authentication related PHP files
│   ├── login.php
│   ├── signup.php
│   ├── logout.php
│   └── check_auth.php
├── config/               # Configuration files
│   └── database.php
├── js/                  # JavaScript files
│   ├── main.js
│   ├── auth.js
│   ├── quiz-generator.js
│   └── notes-generator.js
├── styles/             # CSS stylesheets
│   ├── main.css
│   ├── home.css
│   └── auth.css
├── pages/             # HTML pages
│   ├── login.html
│   ├── signup.html
│   ├── quizzes.html
│   └── notes.html
└── index.html        # Main entry point
```

## Usage

1. Home Page:
   - View available quiz categories
   - Access learning resources
   - Sign up or log in

2. Authentication:
   - Create a new account or log in
   - Use remember me feature for convenience
   - Secure logout functionality

3. Quizzes:
   - Select a subject category
   - Take interactive quizzes
   - View scores and progress
   - Compare rankings on leaderboard

4. Notes Generator:
   - Create AI-generated study notes
   - Customize note format
   - Save and organize notes
   - Export in various formats

## Security Considerations

1. Authentication:
   - Passwords are securely hashed
   - Session tokens are properly managed
   - Remember-me tokens are securely stored

2. Data Protection:
   - Input sanitization
   - Prepared SQL statements
   - XSS prevention
   - CSRF protection

3. Cookie Security:
   - HTTP-only flags
   - Secure cookie settings
   - SameSite policy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request




