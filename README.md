# 🤖 Agentic AI Chat Application

An end-to-end **Agentic AI Chat Application** built using Angular, Node.js, Express.js, MongoDB, Google Gemini, OpenAI, Model Context Protocol (MCP), and Retrieval-Augmented Generation (RAG).

This project demonstrates how Large Language Models (LLMs) can retrieve relevant knowledge, invoke tools, interact with databases, and assist users through natural language conversations.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-Frontend-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular Frontend" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Backend" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Agentic%20AI-LLM%20Tools-8A2BE2?style=for-the-badge" alt="Agentic AI" />
</p>

---

## ✨ Features

### 💬 AI Chat Assistant
- Natural language conversations
- Integration with Google Gemini and OpenAI
- Context-aware AI-generated responses

### 🧠 Agentic AI & MCP
- Model Context Protocol (MCP) integration
- AI-powered tool selection and invocation
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
- Database integration using Mongoose

### 📚 Retrieval-Augmented Generation (RAG)
- Local knowledge base
- Semantic retrieval of relevant information
- Context-grounded AI-generated answers

### 🌦️ External Tool Integration
- Weather information retrieval
- MCP tools for supported services
- External data integration into AI workflows

### 🗄️ Database Integration
- MongoDB database
- Mongoose ODM
- Database-backed CRUD operations

### 🎨 Frontend
- Angular-based user interface
- Chat-oriented user experience
- Integration with backend APIs

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
  <img src="https://img.shields.io/badge/RAG-Retrieval--Augmented%20Generation-0A7E8C?style=for-the-badge" alt="Retrieval-Augmented Generation" />
</p>

### 🗄️ Database

<p>
  <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose ODM" />
</p>

### 🧰 Development Tools

<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,postman" alt="Git, GitHub, Visual Studio Code, Postman" />
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

1. The user submits a message through the Angular interface.
2. The backend receives and processes the request.
3. The AI integration generates a response or selects a supported tool.
4. MCP tools interact with configured services and backend operations.
5. RAG retrieves relevant knowledge when required.
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
│   ├── data/                   # Application or knowledge-base data
│   ├── package.json
│   └── ...
└── README.md
```

> The exact folder structure may vary with the current implementation.

---

## ⚙️ Getting Started

### 📋 Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/)
- [Angular CLI](https://angular.dev/tools/cli), if required by your local setup

You will also need API credentials for the AI providers and external services enabled in your configuration.

### 1. Clone the Repository

```bash
git clone https://github.com/saiabhiramdevarakonda-dot/chatapp.git
cd chatapp
```

### 2. Install Dependencies

Install dependencies separately in each application directory.

**Angular frontend**

```bash
cd technyks-chat-app
npm install
```

**Chat backend**

```bash
cd ../chat-app-backend
npm install
```

**Agentic backend**

```bash
cd ../agentic-app-backend
npm install
```

### 3. Configure Environment Variables

Create the required `.env` files in the appropriate backend directories.

Example configuration:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/testDB
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Add any additional variables required by your implementation, such as weather API credentials or provider-specific model names.

**Security best practices**
- Never commit API keys or `.env` files.
- Add `.env` to `.gitignore`.
- Use separate credentials for development and production.
- Keep API keys in environment variables instead of hardcoding them.

### 4. Start MongoDB

Ensure your MongoDB service is running.

For installations that support launching MongoDB directly:

```bash
mongod
```

If you use MongoDB Atlas, configure `MONGODB_URI` with your Atlas connection string instead.

### 5. Start the Agentic Backend

Open a terminal:

```bash
cd agentic-app-backend
npm run dev
```

Ensure its required environment variables are configured.

### 6. Start the Chat Backend

Open another terminal:

```bash
cd chat-app-backend
npm start
```

Use the command defined in the backend's `package.json` if its start script differs.

### 7. Start the Angular Frontend

Open another terminal:

```bash
cd technyks-chat-app
ng serve
```

Open the local URL printed by Angular CLI, typically:

`http://localhost:4200`

> **Note:** The chat backend and agentic backend are separate services. Start the services required for the feature you want to test, and ensure the frontend API configuration points to the correct backend.

---

## 💡 Example Prompts

Try these prompts, depending on the tools and endpoints configured:

```text
Show all orders.

Find order <order-id>.

Show customer details.

What's the weather in Hyderabad?

Answer my question using the knowledge base.

Create an order for customer <customer-id>.
```

Replace placeholder IDs with valid records. Available actions depend on the backend implementation.

---

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Agentic AI application development
- Large Language Model integration
- Model Context Protocol (MCP)
- AI tool calling and orchestration
- Retrieval-Augmented Generation (RAG)
- Semantic knowledge retrieval
- MongoDB and Mongoose integration
- REST API development
- Angular frontend development
- Node.js, Express.js, and TypeScript
- Full-stack AI application architecture
- Environment configuration and application development

---

## 🔮 Future Improvements

- [ ] 🔐 JWT-based authentication
- [ ] 🛡️ Role-Based Access Control (RBAC)
- [ ] 💬 Persistent conversation history
- [ ] 🐳 Docker containerization
- [ ] ☸️ Kubernetes deployment
- [ ] 🔎 Vector database integration
- [ ] 🔄 CI/CD pipeline
- [ ] 🧪 Unit and integration testing
- [ ] 📊 Application monitoring and logging
- [ ] ☁️ Cloud deployment

---

## 👨‍💻 Author

**Abhiram Devarakonda**

B.Tech — Computer Science and Engineering

<p>
  <a href="https://github.com/saiabhiramdevarakonda-dot">
    <img src="https://img.shields.io/badge/GitHub-saiabhiramdevarakonda--dot-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
</p>

---

## 🙏 Acknowledgements

Developed as part of an exploration of **Agentic AI and full-stack AI application development**, combining LLMs, MCP, RAG, database integration, and modern web technologies.

<p align="center">
  <strong>⭐ If you find this project useful, consider giving the repository a star!</strong>
</p>
