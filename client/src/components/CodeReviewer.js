import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeReviewer = ({ code, highlightLines = [] }) => {
  return (
    <div className="code-review-panel">
      <SyntaxHighlighter 
        language="javascript" 
        style={atomDark}
        customStyle={{ background: 'transparent', padding: '10px' }}
        wrapLines={true}
        showLineNumbers={true}
        lineProps={lineNumber => {
          let style = { display: 'block' };
          if (highlightLines.includes(lineNumber)) {
            style.backgroundColor = 'rgba(0, 210, 255, 0.15)';
            style.borderLeft = '3px solid #00d2ff';
          }
          return { style };
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeReviewer;