# Anuhya Paturu | AI Digital Twin Portfolio

A full-stack interactive portfolio featuring an **AI Digital Twin** that acts as a professional assistant. This project integrates a React-based frontend with a Node.js/Express backend, utilizing OpenAI's GPT-4o-mini to provide real-time insights into my professional background, technical projects, and system architectures.

---

## 🚀 Key Features

* **AI Digital Twin:** A conversational agent trained on my resume to answer recruiter queries instantly.
* **Dynamic Project Gallery:** Automatically fetches my latest work directly from the GitHub REST API.
* **Workflow Deep-Dives:** Provides an automated technical breakdown of specific repositories.
* **Interactive UI:** Modern, responsive design with "word-reveal" animations and live technical visualizations (System Architecture & Code Snippets).
* **Direct Scheduling:** Integrated Calendly for seamless interview booking.

---

## 🛠️ Technical Stack

### Frontend
* **React.js:** Component-based UI architecture.
* **Lucide React:** For consistent, high-quality iconography.
* **CSS3 Animations:** Custom word-by-word reveal logic for AI responses.

### Backend
* **Node.js & Express:** Scalable server-side logic and API management.
* **OpenAI API (GPT-4o-mini):** Large Language Model integration for professional context processing.
* **GitHub REST API:** For real-time project synchronization.

---

## 📂 Project Structure


ai-persona-portfolio/
├── client/           # React Frontend
│   ├── src/          # Components (TechArchitecture, CodeReviewer)
│   └── public/       # Static assets & Character Video
└── server/           # Node.js Backend
    ├── index.js      # API routes & OpenAI Logic
    ├── resume.txt    # Knowledge base for the AI
    └── .env          # Environment variables (Excluded from Git)


⚙️ Installation & Setup
Clone the repository:

Bash
git clone [https://github.com/AnuhyaPaturu/ai-persona-portfolio.git] (https://github.com/AnuhyaPaturu/ai-persona-portfolio.git)
cd ai-persona-portfolio
Setup the Backend:

Bash
cd server
npm install
# Create a .env file and add:
# OPENAI_API_KEY=your_key_here
node index.js
Setup the Frontend:

Bash
cd ../client
npm install
npm start


🧠 How the AI Works
The AI Digital Twin uses a Retrieval-Augmented Generation (RAG) inspired approach. When a user asks a question, the backend reads the resume.txt file, 
injects it into a system prompt as context, and queries the OpenAI API. This ensures the AI only speaks about my verified professional experience while maintaining a helpful, grounded persona.
