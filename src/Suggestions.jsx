import React from 'react';

const Suggestions = ({ suggestions, onSelect, onClose }) => {
    return (
      <div className="suggestions-card">
        <h3>Suggestions</h3>
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => onSelect(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  

export default Suggestions;
