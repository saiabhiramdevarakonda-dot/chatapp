# 🤖 Agentic AI Chat Application

An end-to-end **Agentic AI Chat Application** built with Angular, Node.js, Express.js, MongoDB, Google Gemini, OpenAI, Model Context Protocol (MCP), and Retrieval-Augmented Generation (RAG).

This project demonstrates how Large Language Models (LLMs) can retrieve relevant knowledge, invoke tools, interact with databases, and execute tasks through natural language conversations.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-Frontend-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-Agentic%20AI-8A2BE2?style=for-the-badge" alt="Agentic AI" />
</p>

---

## ✨ Features

### 💬 AI Chat Assistant
- Natural language conversations
- Integration with Google Gemini and OpenAI
- Context-aware AI-generated responses

### 🧠 Agentic AI & Model Context Protocol
- MCP server and tool integration
- AI-driven tool selection and invocation
- Multi-step task execution
- Interaction between LLMs and backend services

### 📦 Order Management
- Retrieve orders
- Search orders by ID
- Find orders associated with customers
- Create new orders
- MongoDB-backed data persistence

### 👥 Customer Management
- Retrieve customer records
- Search customers
- Database integration through Mongoose

### 📚 Retrieval-Augmented Generation (RAG)
- Local knowledge base
- Semantic retrieval of relevant information
- Context-grounded AI responses

### 🌦️ External Tool Integration
- Weather information retrieval
- MCP tools for supported services
- Integration of external data into AI workflows

### 🗄️ Database Integration
- MongoDB
- Mongoose ODM
- Database-backed CRUD operations

### 🎨 Web Interface
- Angular frontend
- Chat-oriented user interface
- Backend API integration

---

## 🛠️ Tech Stack

### 🎨 Frontend

<p>
  <img src="https://skillicons.dev/icons?i=angular,typescript,html,css,sass" alt="Angular, TypeScript, HTML, CSS, Sass" />
</p>

### ⚙️ Backend

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,typescript" alt="Node.js, Express.js, TypeScript" />
</p>

### 🤖 AI & LLM Integration

<p>
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Model%20Context%20Protocol-MCP-2F6F9F?style=for-the-badge" alt="Model Context Protocol" />
  <img src="https://img.shields.io/badge/RAG-Retrieval--Augmented%20Generation-0A7E8C?style=for-the-badge" alt="RAG" />
</p>

### 🗄️ Database

<p>
  <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

### 🧰 Development Tools & Deployment

<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,postman" alt="Git, GitHub, Visual Studio Code, Postman" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />
</p>

---

## 🏗️ Architecture

```text
                         ┌────────────────────┐
                         │        User        │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │  Angular Frontend  │
                         └─────────┬──────────┘
                                   │ HTTP / REST API
                                   ▼
                         ┌────────────────────┐
                         │   Express Backend  │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │      AI Agent      │
                         └─────────┬──────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
        │   MCP Tools     │ │     RAG      │ │    MongoDB     │
        ├────────────────┤ ├──────────────┤ ├────────────────┤
        │ Customer Tool  │ │ Knowledge    │ │ Customers      │
        │ Order Tool     │ │ Base         │ │ Orders         │
        │ Weather Tool   │ │              │ │                │
        └────────────────┘ └──────────────┘ └────────────────┘
```

### Architecture Overview

1. The user sends a message through the Angular interface.
2. The backend receives and processes the request.
3. The AI integration generates a response or selects a supported tool.
4. MCP tools interact with supported services and backend operations.
5. RAG retrieves relevant information from the knowledge base when applicable.
6. MongoDB stores and retrieves application data.
7. The backend returns the result to the frontend.

---

## 📁 Project Structure

```text
chatapp/
├── technyks-chat-app/          # Angular frontend
├── chat-app-backend/           # AI chat backend
├── agentic-app-backend/        # Agentic backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── data/                   # Knowledge-base or application
