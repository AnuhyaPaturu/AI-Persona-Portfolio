import React, { useState } from 'react';
import { Target, Sparkles, Loader2, Award } from 'lucide-react';

const RoleMatcher = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState('');
  const [matchScore, setMatchScore] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription) return;
    setIsAnalyzing(true);
    setMatchScore(null); // Reset score for new analysis
    
    try {
      const response = await fetch('https://sorry-fayth-self-employee-907f0163.koyeb.app/api/match-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: jobDescription }),
      });
      const data = await response.json();
      
      const fullContent = data.analysis;
      
      // Logic to extract score from the first line "SCORE: 95"
      if (fullContent.startsWith("SCORE:")) {
        const lines = fullContent.split('\n');
        const scoreLine = lines[0]; // "SCORE: 95"
        const scoreValue = scoreLine.replace("SCORE:", "").trim();
        
        setMatchScore(scoreValue);
        setMatchResult(lines.slice(1).join('\n').trim()); // Everything except the score line
      } else {
        setMatchResult(fullContent);
      }
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
          Paste a Job Description to see your compatibility score and fit analysis.
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
            <Loader2 className="animate-spin" size={18} /> Syncing Skillsets...
          </>
        ) : (
          <>
            <Sparkles size={18} /> Calculate Match Score
          </>
        )}
      </button>

      {matchResult && (
        <div className="analysis-result">
          <div className="result-header-area">
             {matchScore && (
               <div className="score-circle">
                 <span className="score-num">{matchScore}</span>
                 <span className="score-label">MATCH</span>
               </div>
             )}
             <div className="result-label">System Analysis Results:</div>
          </div>
          <div className="result-text">{matchResult}</div>
        </div>
      )}
    </div>
  );
};

export default RoleMatcher;