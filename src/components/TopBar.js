import React from 'react';

const TopBar = ({ searchText, onSearchChange, darkMode, onThemeToggle }) => {
  return (
    <div className="topBar">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="searchInput"
      />
      <button 
        className="themeToggle" 
        onClick={onThemeToggle}
        title="Toggle dark mode (Ctrl+D)"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default React.memo(TopBar);
