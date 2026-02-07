import React, { useState } from 'react';
import { Target, Sparkles, Loader2 } from 'lucide-react';

const RoleMatcher = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState('');

  const handleMatch = async () => {
    if (!jobDescription) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://sorry-fayth-self-employee-907f0163.koyeb.app/api/match-role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ description: jobDescription }), // 'description' must match backend
});
      const data = await response.json();
      setMatchResult(data.analysis);
    } catch (err) {
      setMatchResult("Analysis system is temporarily offline. Please try again shortly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="matcher-container">
      <div className="matcher-header">
        <h2 className="matcher-title">
          <Target className="matcher-icon" /> Role Matcher
        </h2>
        <p className="matcher-subtitle">
          Paste a Job Description below to see how my projects align with your role.
        </p>
      </div>

      <textarea
        className="matcher-textarea"
        placeholder="Paste requirements, tech stack, or job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button 
        className={`matcher-btn ${isAnalyzing ? 'loading' : ''}`} 
        onClick={handleMatch}
        disabled={isAnalyzing || !jobDescription}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Analyzing System Alignment...
          </>
        ) : (
          <>
            <Sparkles size={18} /> Check Match
          </>
        )}
      </button>

      {matchResult && (
        <div className="analysis-result">
          <div className="result-label">System Analysis Results:</div>
          <div className="result-text">{matchResult}</div>
        </div>
      )}
    </div>
  );
};

export default RoleMatcher;