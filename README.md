# 🤖 Agentic AI Chat Application

An end-to-end **Agentic AI Chat Application** built with **Angular**, **Node.js**, **Express**, **MongoDB**, **Google Gemini/OpenAI**, **Model Context Protocol (MCP)**, and **Retrieval-Augmented Generation (RAG)**.

The application demonstrates how Large Language Models (LLMs) can intelligently use tools, retrieve knowledge from documents, and interact with a real MongoDB database to answer user queries and perform actions.

---

# 🚀 Features

### 💬 AI Chat Assistant

* Natural language conversations
* Powered by Google Gemini/OpenAI
* Context-aware responses

### 🛠️ Agentic AI

* Model Context Protocol (MCP)
* Intelligent tool selection
* Multi-step reasoning
* Tool calling

### 📦 Order Management

* View all orders
* Search order by ID
* Search customer orders
* Create new orders
* MongoDB persistence

### 👥 Customer Management

* View customers
* Search customers
* MongoDB integration

### 📚 RAG (Retrieval-Augmented Generation)

* Local knowledge base
* Semantic retrieval
* AI-generated answers using retrieved context

### 🌦️ External Tool Integration

* Weather tool support
* Multiple MCP tools

### 🗄️ Database

* MongoDB
* Mongoose ODM
* Real-time CRUD operations

### 🎨 Frontend

* Angular
* Responsive UI
* Chat interface

---

# 🏗️ Architecture

```
User
   │
   ▼
Angular Frontend
   │
   ▼
Express Backend
   │
   ▼
AI Agent
   │
   ├──────────────► MCP Tools
   │                  │
   │                  ├── Customer Tool
   │                  ├── Order Tool
   │                  └── Weather Tool
   │
   ├──────────────► RAG
   │                  │
   │                  └── Knowledge Base
   │
   └──────────────► MongoDB
```

---

# 🛠️ Tech Stack

## Frontend

* Angular
* TypeScript
* HTML
* CSS

## Backend

* Node.js
* Express.js
* TypeScript

## AI

* Google Gemini
* OpenAI
* MCP SDK
* RAG

## Database

* MongoDB
* Mongoose

## Development Tools

* Git
* GitHub
* VS Code
* Postman

---

# 📁 Project Structure

```
chatapp/
│
├── technyks-chat-app/        # Angular Frontend
│
├── chat-app-backend/         # Chat Backend
│
├── agentic-app-backend/      # Agent Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── mcp/
│   ├── rag/
│   ├── data/
│   └── config/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/saiabhiramdevarakonda-dot/chatapp.git

cd chatapp
```

---

## Install Dependencies

```bash
npm install
```

Install dependencies inside:

* technyks-chat-app
* chat-app-backend
* agentic-app-backend

---

## Environment Variables

Create a `.env` file inside the backend project.

Example:

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/testDB

OPENAI_API_KEY=YOUR_OPENAI_KEY

GEMINI_API_KEY=YOUR_GEMINI_KEY
```

---

## Start MongoDB

```bash
mongod
```

---

## Start Backend

```bash
cd agentic-app-backend

npm run dev
```

---

## Start Angular Frontend

```bash
cd technyks-chat-app

ng serve
```

---

# 💬 Example Prompts

```
Show all orders

Create an order for customer <customer-id>

Show customer details

What's the weather in Hyderabad?

Answer questions from the knowledge base.
```

---

# 📸 Screenshots

Add screenshots here.

Example:

```
docs/screenshots/chat.png

docs/screenshots/orders.png

docs/screenshots/mcp.png
```

---

# 🎯 Learning Outcomes

This project demonstrates:

* Agentic AI
* MCP (Model Context Protocol)
* Tool Calling
* RAG
* MongoDB Integration
* REST APIs
* Angular Frontend
* Express Backend
* TypeScript
* LLM Integration
* Full-Stack AI Development

---

# 🔮 Future Improvements

* Authentication (JWT)
* Role-Based Access Control
* Conversation History
* Docker Support
* Kubernetes Deployment
* Vector Database (FAISS/Pinecone)
* CI/CD Pipeline
* Unit & Integration Testing
* Cloud Deployment (AWS/Azure/GCP)

---

# 👨‍💻 Author

**Abhiram Devarakonda**

B.Tech Computer Science Engineering

GitHub: https://github.com/saiabhiramdevarakonda-dot

---

# ⭐ Acknowledgements

This project was developed as part of an AI Agent/Agentic AI learning journey, demonstrating modern AI application development using LLMs, MCP, RAG, MongoDB, and Angular.
