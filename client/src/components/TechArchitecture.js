import React from 'react';

const TechArchitecture = ({ activeNode }) => {
  const getStyle = (id) => ({
    stroke: activeNode === id ? '#00d2ff' : '#4b5563',
    strokeWidth: activeNode === id ? '3' : '1.5',
    filter: activeNode === id ? 'drop-shadow(0 0 8px #00d2ff)' : 'none',
    transition: 'all 0.5s ease',
  });

  const getTextStyle = (id) => ({
    fill: activeNode === id ? '#00d2ff' : '#94a3b8',
    fontWeight: activeNode === id ? '700' : '400',
    transition: 'all 0.5s ease',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif'
  });

  return (
    <div className="arch-viz">
      <svg viewBox="0 0 400 160" width="100%">
        {/* Frontend */}
        <rect x="20" y="50" width="90" height="50" rx="8" style={getStyle('frontend')} fill="#1f2937" />
        <text x="65" y="80" textAnchor="middle" style={getTextStyle('frontend')}>React/Angular</text>
        
        {/* API Gateway */}
        <line x1="110" y1="75" x2="155" y2="75" style={getStyle('api')} markerEnd="url(#arrowhead)" />
        <rect x="155" y="50" width="90" height="50" rx="8" style={getStyle('backend')} fill="#1f2937" />
        <text x="200" y="80" textAnchor="middle" style={getTextStyle('backend')}>.NET / Node.js</text>
        
        {/* Database */}
        <line x1="245" y1="75" x2="290" y2="75" style={getStyle('db')} markerEnd="url(#arrowhead)" />
        <path d="M290 60 Q290 50 335 50 Q380 50 380 60 V90 Q380 100 335 100 Q290 100 290 90 Z" 
              style={getStyle('db')} fill="#1f2937" />
        <text x="335" y="80" textAnchor="middle" style={getTextStyle('db')}>SQL/Postgres</text>

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default TechArchitecture;