import React from 'react';
import { format, parseISO } from 'date-fns';
import { Draggable } from '@hello-pangea/dnd';

const TaskItem = ({
  task,
  index,
  editingId,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onSaveEdit,
  onToggleComplete,
  onDeleteTask
}) => {
  return (
    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
      {(prov, snap) => (
        <div
          ref={prov.innerRef}
          {...prov.draggableProps}
          {...prov.dragHandleProps}
          className={`taskItem ${task.completed ? 'completed' : ''} ${snap.isDragging ? 'dragging' : ''}`}
        >
          <div className="left">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
            />
            {editingId === task.id ? (
              <input
                className="editInput"
                value={editingText}
                onChange={(e) => onEditingTextChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(task.id)}
                onBlur={() => onSaveEdit(task.id)}
                autoFocus
              />
            ) : (
              <div className="taskMain">
                <span className="taskText" onDoubleClick={() => onStartEdit(task)}>
                  {task.text}
                </span>
                {task.tags && task.tags.length > 0 && (
                  <div className="taskTags">
                    {task.tags.map(tag => (
                      <span key={tag} className="taskTag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {task.due && (
                  <span className="dueText">
                    {format(parseISO(task.due), 'Pp')}
                    {task.recurrence && task.recurrence !== 'none' ? ` (${task.recurrence})` : ''}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="deleteBtn"
            title="Hapus tugas"
          >
            🗑️
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(TaskItem);
