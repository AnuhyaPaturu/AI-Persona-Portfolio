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

// Main AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const resumePath = path.join(__dirname, 'resume.txt');
    
    // Using fs.existsSync which is the safe, modern way to check file availability
    if (!fs.existsSync(resumePath)) {
      return res.status(500).json({ error: "Resume data file not found on server." });
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
          Highlight her 40% efficiency improvements and her Master's from CSULB. Also focus on her latest AI interests and trying to build projects. 
          STRICT RULES: 
          1. Use standard English grammar with proper spaces between words.
          2. Keep responses concise (under 4 sentences).
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

// Project Workflow Explanation Endpoint
app.post('/api/project-explain', async (req, res) => {
  try {
    const { repoName, userMessage } = req.body;
    
    // Fetch the README directly from GitHub Raw content
    const githubUrl = `https://raw.githubusercontent.com/AnuhyaPaturu/${repoName}/main/README.md`;
    const githubRes = await fetch(githubUrl);
    
    if (!githubRes.ok) {
        return res.status(404).json({ error: "README not found for this repository." });
    }
    
    const readmeContent = await githubRes.text();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a technical lead. Based on this README: ${readmeContent}, explain the project's workflow. 
          Keep it to 4 to 5 sentences. Focus on the data flow and technology used. 
          Ensure proper spacing and professional grammar.` 
        },
        { role: "user", content: userMessage || "Explain the workflow of this project." },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch or process project data." });
  }
});

// Dynamic GitHub Projects Fetching
app.get('/api/github-projects', async (req, res) => {
  try {
    const githubRes = await fetch('https://api.github.com/users/AnuhyaPaturu/repos?sort=updated');
    const repos = await githubRes.json();

    const filteredRepos = repos
      .filter(repo => !repo.fork) 
      .map(repo => ({
        title: repo.name.replace(/-/g, ' '), 
        desc: repo.description || "Technical project exploring modern web stacks.",
        repo: repo.name,
        tech: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language].filter(Boolean),
        url: repo.html_url
      }))
      .slice(0, 6); 

    res.json(filteredRepos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch GitHub projects" });
  }
});



app.post('/api/match-role', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: "No JD provided" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are a technical recruiting expert. 
          Analyze Anuhya Paturu's resume (MS in CS, Full-Stack Engineer) and the projects in github against the provided Job Description.
          
          STRICT OUTPUT FORMAT:
          Line 1: SCORE: [number]
          Followed by a concise professional analysis highlighting her strengths and project fit.
          
          Ensure the score reflects her 2+ years of experience and specific expertise in React, Node.js, and AIOps.`
        },
        { role: "user", content: `Job Description: ${description}` }
      ],
    });
    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("Internal Error:", error);
    res.status(500).json({ error: "Server Internal Error" });
  }
});

// Production Port Configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});