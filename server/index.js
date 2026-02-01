const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const resumePath = path.join(__dirname, 'resume.txt');
    
    if (!fs.existsSync(resumePath)) {
      return res.status(500).json({ error: "Resume data file not found." });
    }
    const resumeData = fs.readFileSync(resumePath, 'utf8');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are the Digital Twin of Anuhya Paturu, a Full Stack Engineer. 
          Use this background: ${resumeData}. 
          Your tone is professional and helpful. Focus on her experience with .NET, React, and Node.js. 
          Highlight her 40% efficiency improvements and her Master's from CSULB. STRICT RULES: 
      1. Use standard English grammar with proper spaces between words.
      2. Keep responses concise (under 5 sentences).
      3. Never concatenate words together.` 
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// project explanation
app.post('/api/project-explain', async (req, res) => {
  try {
    const { repoName, userMessage } = req.body;
    
    // 1. Fetch the README from your GitHub
    const githubUrl = `https://raw.githubusercontent.com/AnuhyaPaturu/${repoName}/main/README.md`;
    const githubRes = await fetch(githubUrl);
    const readmeContent = await githubRes.text();

    // 2. Send the README to OpenAI to summarize the "Workflow"
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a technical lead. Based on this README: ${readmeContent}, explain the project's workflow. 
          Keep it upto 4 to 5 sentences. Focus on the data flow and technology used.` 
        },
        { role: "user", content: userMessage || "Explain the workflow of this project." },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch project data." });
  }
});

app.get('/api/github-projects', async (req, res) => {
  try {
    // 1. Fetch repos from GitHub
    const githubRes = await fetch('https://api.github.com/users/AnuhyaPaturu/repos?sort=updated');
    const repos = await githubRes.json();

    // 2. Filter for specific projects (optional: only those with a specific star count or topic)
    const filteredRepos = repos
      .filter(repo => !repo.fork) // Exclude forks
      .map(repo => ({
        title: repo.name.replace(/-/g, ' '), // Clean up names like 'my-repo' to 'my repo'
        desc: repo.description || "Technical project exploring modern web stacks.",
        repo: repo.name,
        tech: repo.topics || [repo.language].filter(Boolean), // Uses GitHub topics/primary language
        url: repo.html_url
      }))
      .slice(0, 6); // Only show top 6

    res.json(filteredRepos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub projects" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));