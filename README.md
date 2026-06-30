# 🤖 AI ChatApp – Full Stack AI Chatbot with Gemini & RAG

A full-stack AI Chatbot System built using **Angular**, **Node.js**, **Express.js**, **TypeScript**, and **Google Gemini API**.

The project integrates **Retrieval-Augmented Generation (RAG)** with semantic search and local embeddings to provide intelligent, context-aware responses from a custom knowledge base while also supporting general AI conversations using Google's Gemini model.

---

# 📖 About

This project was developed as part of my learning journey in **Full Stack Development** and **Generative AI**. It demonstrates frontend-backend integration, REST APIs, Retrieval-Augmented Generation (RAG), semantic search, and Google Gemini API integration.

---

# 🏗️ Project Architecture

```
                    Angular Frontend
                           │
                           ▼
              Chat Backend (Express.js)
                     │             │
                     ▼             ▼
              Google Gemini     RAG Engine
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
               FAQ Database            Knowledge Base

                     │
                     ▼

            Agentic Backend (Express + TypeScript)
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Orders API  Customers API  Weather API
```

---

# 📂 Project Structure

```
chatapp
│
├── technyks-chat-app/      # Angular Frontend
├── chat-app-backend/       # AI Chatbot Backend (Gemini + RAG)
└── agentic-app-backend/    # Agentic Backend APIs
```

---

# 🚀 Features

## 💻 Frontend

- Modern Angular Chat Interface
- Responsive User Interface
- API Integration
- Environment Configuration

## 🤖 AI Chat Backend

- Google Gemini 2.5 Flash Integration
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Local Embedding Generation
- FAQ Retrieval
- Knowledge Base Retrieval
- Intelligent AI Responses
- REST API

## 🧠 Agentic Backend

- Orders API
- Customers API
- Weather API
- Chat API
- Modular Express Architecture
- TypeScript Support

---

# 🛠️ Tech Stack

## Frontend

- Angular
- TypeScript
- HTML
- SCSS

## Backend

- Node.js
- Express.js
- JavaScript
- TypeScript

## Artificial Intelligence

- Google Gemini API
- Gemini 2.5 Flash
- Retrieval-Augmented Generation (RAG)
- Local Embeddings
- Xenova/all-MiniLM-L6-v2
- Cosine Similarity Search

## Tools

- Git
- GitHub
- Visual Studio Code
- npm

---

# 📚 Skills Demonstrated

- Full Stack Development
- REST API Development
- Angular Development
- Express.js
- TypeScript
- JavaScript
- Artificial Intelligence
- Generative AI
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- API Integration
- Git & GitHub

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/saiabhiramdevarakonda-dot/chatapp.git
```

---

## Install Frontend

```bash
cd technyks-chat-app
npm install
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

## Install Chat Backend

```bash
cd chat-app-backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

## Install Agentic Backend

```bash
cd agentic-app-backend
npm install
npm run dev
```

Recommended port:

```
http://localhost:3001
```

---

# 🔑 Environment Variables

Create a `.env` file inside each backend.

Example:

```env
GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

---

# 📡 API Endpoints

## Chat Backend

```
POST /api/chat
```

## Agentic Backend

```
GET    /api/orders
GET    /api/orders/:id
GET    /api/customers
GET    /api/weather?q=city
POST   /api/chat
```
---

# 🚀 Planned Enhancements

- User Authentication
- Chat History
- Database Integration
- MongoDB Support
- Vector Database
- Multi-Agent Architecture
- Voice Assistant
- File Upload Support
- Streaming AI Responses
- Docker Deployment
- CI/CD Pipeline

---

# 👨‍💻 Author

**Abhiram Devarakonda**

B.Tech Computer Science Engineering

Interested in Artificial Intelligence, Machine Learning, Full Stack Development, and Generative AI.

---

# 🙏 Acknowledgements

This project was developed while learning Full Stack Development and Generative AI concepts through online coursework. It was further enhanced with additional features, debugging, and improvements including Retrieval-Augmented Generation (RAG), Google Gemini API integration, semantic search, and an agentic backend.

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.
