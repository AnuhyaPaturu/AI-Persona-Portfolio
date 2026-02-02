import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Send, Cpu, Code, Briefcase, 
  GraduationCap, Mail, Linkedin, Github, Phone, MapPin, Database, Cloud, Calendar, Menu, ExternalLink, Info 
} from 'lucide-react';
import './App.css';

// Importing Visual Components
import TechArchitecture from './components/TechArchitecture';
import CodeReviewer from './components/CodeReviewer';

// Importing the local video file
import characterVideo from './Realistic_Character_Video_Generation.mp4';

function App() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // AI Side Panel State
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Menu State
  const chatEndRef = useRef(null);

  // Initial greeting for the AI
  const initialMessages = [
    { role: 'ai', text: "Hi! I'm Anuhya's AI assistant. Ask me about her work, or click 'Workflow' on any project to see a live analysis." }
  ];

  // State for conversation history
  const [messages, setMessages] = useState(initialMessages);

  // State for AI Visual Insights
  const [vizData, setVizData] = useState({ type: null, activeId: null, lines: [] });

  // NEW: State for Dynamic GitHub Projects
  const [projects, setProjects] = useState([]);

  // --- NEW: Fetch GitHub Projects from Backend ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/github-projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading dynamic projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // --- Reset Chat when Sidebar is closed ---
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setMessages(initialMessages);
        setVizData({ type: null, activeId: null, lines: [] });
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll to bottom of AI chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // General AI Chat Logic
  const handleAskAI = async (overrideInput = null) => {
    const query = overrideInput || input;
    if (!query) return;

    // Add User Message to History
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    const lowerInput = query.toLowerCase();
    if (lowerInput.includes('architecture') || lowerInput.includes('design') || lowerInput.includes('system')) {
      setVizData({ type: 'arch', activeId: 'backend' });
    } else if (lowerInput.includes('code') || lowerInput.includes('snippet') || lowerInput.includes('react')) {
      setVizData({ type: 'code', lines: [3, 4, 5, 6, 7] });
    }

    try {
      const response = await fetch('https://sorry-fayth-self-employee-907f0163.koyeb.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await response.json();
      
      // Add AI Response to History
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // NEW: Project Workflow Deep Dive (GitHub Integration)
  const handleProjectDeepDive = async (repoName) => {
    setIsOpen(true); 
    const query = `Explain the workflow for the ${repoName} project.`;
    handleAskAI(query);
    setVizData({ type: 'arch', activeId: 'api' }); // Show architecture for the workflow
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="portfolio-container">
      {/* --- NAVIGATION --- */}
      <nav className="navbar">
        <div className="logo">ANUHYA<span>.</span></div>
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
        <div className={`links ${isMenuOpen ? 'nav-active' : ''}`}>
          <div className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
            <X size={32} />
          </div>
          <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
          <a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a>
          <a href="#schedule" onClick={() => setIsMenuOpen(false)}>Schedule</a>
          <a href="#education" onClick={() => setIsMenuOpen(false)}>Education</a>
          <a href="mailto:paturuanuhya@gmail.com" className="contact-btn">Hire Me</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Anuhya <span>Paturu</span></h1>
            <p>Experienced Full Stack Engineer with 2+ years of expertise in designing and developing scalable web applications. Master of Science in Computer Science candidate at CSULB.</p>
            <div className="hero-action-area">
              <a href="#schedule" className="schedule-cta"><Calendar size={20} /> Schedule Interview</a>
              <div className="social-links">
                <a href="https://github.com/AnuhyaPaturu" target="_blank" rel="noreferrer"><Github size={24} /></a>
                <a href="https://linkedin.com/in/anuhyap" target="_blank" rel="noreferrer"><Linkedin size={24} /></a>
              </div>
            </div>
            <div className="contact-bar">
              <a href="mailto:paturuanuhya@gmail.com"><Mail size={18}/> paturuanuhya@gmail.com</a>
              <a href="tel:+15624465186"><Phone size={18}/> +1 562-446-5186</a>
              <span><MapPin size={18}/> United States</span>
            </div>
          </div>
          <div className="hero-character-wrapper-small">
            <div className="character-main-small">
              <video className="character-video-refined" autoPlay loop muted playsInline>
                <source src={characterVideo} type="video/mp4" />
              </video>
            </div>
            <div className="character-glow-orb"></div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS GALLERY SECTION --- */}
      <section id="projects" className="section">
        <h2 className="section-title"><Code size={28} /> Technical Projects</h2>
        <div className="projects-bento-grid">
          {projects.map((proj) => (
            <div key={proj.repo} className="project-bento-card">
              <div className="project-card-inner">
                <div className="project-card-header">
                  <div className="tech-stack-icons">
                    <Cpu size={16} className="tech-icon-pulse" />
                    <Database size={16} />
                  </div>
                  <a href={proj.url} target="_blank" rel="noreferrer" className="github-link">
                    <Github size={20} />
                  </a>
                </div>
                
                <div className="project-card-content">
                  <h3>{proj.title}</h3>
                  <p>{proj.desc}</p>
                </div>

                <div className="project-card-footer">
                  <div className="tech-tags-wrapper">
                    {proj.tech.map(t => <span key={t} className="tech-tag-mini">{t}</span>)}
                  </div>
                  <button className="workflow-btn" onClick={() => handleProjectDeepDive(proj.repo)}>
                    <Info size={14} /> Workflow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience" className="section bg-alt">
        <h2 className="section-title"><Briefcase size={28} /> Professional Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="time-header">
              <h3>Full Stack Engineer</h3>
              <span className="company">Saayam For All | Aug 2025 - Present</span>
            </div>
            <p className="impact-stat">Donations increased by 35%</p>
            <ul>
              <li>Engineered end-to-end features using React, HTML, CSS, and REST APIs.</li>
              <li>Developed backend services with Node.js and PostgreSQL for real-time tracking.</li>
              <li>Reduced system latency by 30% through advanced query optimization.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <div className="time-header">
              <h3>Full Stack Engineer</h3>
              <span className="company">Cognizant | Aug 2022 - July 2023</span>
            </div>
            <p className="impact-stat">Dashboard load times reduced by 30%</p>
            <ul>
              <li>Modernized CXO Dashboard using .NET, Angular, and SQL Server.</li>
              <li>Optimized APIs to improve real-time data retrieval and system reliability.</li>
              <li>Refactored data pipelines, improving fetch efficiency by 25%.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <div className="time-header">
              <h3>Junior Full Stack Engineer</h3>
              <span className="company">Cognizant | Aug 2021 - July 2022</span>
            </div>
            <p className="impact-stat">Efficiency improved by 40%</p>
            <ul>
              <li>Implemented 6+ critical features for CXO Dashboard using Angular.</li>
              <li>Transformed legacy SQL into optimized scalable data models.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <div className="time-header">
              <h3>Software Intern</h3>
              <span className="company">Cognizant | Feb 2021 - July 2021</span>
            </div>
            <p className="impact-stat">Reporting efficiency improved by 35%</p>
            <ul>
              <li>Developed Portfolio Management System with React.js and Flask.</li>
              <li>Secured app with JWT and OAuth authentication for role-based access.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="section">
        <h2 className="section-title"><Cpu size={28} /> Technical Ecosystem</h2>
        <div className="skills-container">
          <div className="skill-category">
            <h4><Code size={18}/> Languages</h4>
            <div className="skill-tags">
              {["Python", "Java", "C#", "TypeScript", "Golang", "JavaScript", "C++"].map(s => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="skill-category">
            <h4><Cpu size={18}/> Frameworks</h4>
            <div className="skill-tags">
              {["React.js", "Angular", ".NET Core", "Node.js", "Django", "FastAPI", "Spring Boot", "Flask"].map(s => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="skill-category">
            <h4><Cloud size={18}/> Cloud & DevOps</h4>
            <div className="skill-tags">
              {["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"].map(s => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="skill-category">
            <h4><Database size={18}/> Data & Security</h4>
            <div className="skill-tags">
              {["PostgreSQL", "SQL Server", "MongoDB", "JWT", "OAuth 2.0", "GraphQL"].map(s => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* --- EDUCATION SECTION --- */}
      <section id="education" className="section bg-alt">
        <h2 className="section-title"><GraduationCap size={28} /> Education</h2>
        <div className="edu-card">
          <div className="edu-info">
            <h3>Master of Science in Computer Science</h3>
            <p className="edu-school">California State University, Long Beach, USA</p>
          </div>
          <span className="edu-date">Aug 2023 - May 2025</span>
        </div>
      </section>

      {/* --- SCHEDULING SECTION --- */}
      <section id="schedule" className="section">
        <h2 className="section-title"><Calendar size={28} /> Book an Interview</h2>
        <div className="booking-container">
          <div className="booking-info">
            <h3>Let's discuss more.</h3>
            <p>Pick a time for a 30-minute call directly through my calendar synced with my local time.</p>
          </div>
          <div className="calendar-frame">
            <iframe 
              src="https://calendly.com/paturuanuhya/30min" 
              width="100%" 
              height="600" 
              frameBorder="0"
              title="Schedule Appointment"
            ></iframe>
          </div>
        </div>
      </section>

      {/* --- AI SIDEBAR --- */}
      <button className={`ai-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <aside className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="ai-sidebar-header">
          <div className="human-persona">
            <div className="avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Avatar" className="human-avatar" />
              <span className="online-indicator"></span>
            </div>
            <div className="persona-details">
              <h3>Anuhya's Digital Twin</h3>
              <p>Professional Assistant</p>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setIsOpen(false)}><X size={20}/></button>
        </div>

        <div className="ai-sidebar-body">
          {vizData.type && (
            <div className="ai-viz-display">
              <div className="viz-header">
                <span>{vizData.type === 'arch' ? 'Workflow Architecture' : 'Technical Insight'}</span>
                <button onClick={() => setVizData({ type: null })}>Close</button>
              </div>
              {vizData.type === 'arch' && <TechArchitecture activeNode={vizData.activeId} />}
              {vizData.type === 'code' && (
                <CodeReviewer 
                  code={`// Optimized Data Fetching Hook\nconst useDashboardData = (apiEndpoint) => {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch(apiEndpoint).then(res => res.json()).then(setData);\n  }, [apiEndpoint]);\n  return data;\n};`}
                  highlightLines={vizData.lines}
                />
              )}
            </div>
          )}

          <div className="chat-history">
            {messages.map((msg, index) => {
              const isLatestAI = msg.role === 'ai' && index === messages.length - 1;

              return (
                <div key={`${index}-${msg.role}`} className={`chat-bubble ${msg.role}`}>
                  {isLatestAI ? (
                    <div style={{ display: 'inline' }}>
                      {msg.text.split(' ').map((word, i) => (
                        <span 
                          key={i} 
                          className="word-reveal" 
                          style={{ animationDelay: `${i * 0.08}s`, marginRight: '4px' }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div className="chat-bubble ai typing">
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="ai-sidebar-footer">
          <div className="input-group">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskAI()} placeholder="Ask about her systems..." />
            <button onClick={() => handleAskAI()} disabled={isTyping}><Send size={18}/></button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;