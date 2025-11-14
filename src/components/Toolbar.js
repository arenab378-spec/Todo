import React from 'react';

const Toolbar = ({
  filter,
  onFilterChange,
  allTags,
  filterTag,
  onFilterTagChange,
  remaining,
  onClearCompleted,
  notificationsEnabled,
  onToggleNotifications
  , onUndo, onRedo, canUndo, canRedo
}) => {
  return (
    <div className="toolbar">
      <div className="undoRedo">
        <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">↶ Undo</button>
        <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
      </div>
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => onFilterChange('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => onFilterChange('active')}>Active</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => onFilterChange('completed')}>Completed</button>
      </div>
      <div className="tags-filter">
        {allTags.length > 0 && (
          <div className="tagsList">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tagBadge ${filterTag === tag ? 'active' : ''}`}
                onClick={() => onFilterTagChange(filterTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="meta">
        <span>{remaining} left</span>
        <button className="clearBtn" onClick={onClearCompleted}>Clear Completed</button>
        <button 
          className="clearBtn" 
          onClick={onToggleNotifications}
        >
          {notificationsEnabled ? 'Disable Reminders' : 'Enable Reminders'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
