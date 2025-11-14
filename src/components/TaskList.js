import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';

const TaskList = ({
  filtered,
  editingId,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onSaveEdit,
  onToggleComplete,
  onDeleteTask
}) => {
  return (
    <Droppable droppableId="tasks">
      {(provided) => (
        <div className="tasksList" ref={provided.innerRef} {...provided.droppableProps}>
          {filtered.length === 0 ? (
            <p className="emptyMessage">Belum ada tugas. Tambahkan sekarang! 🎯</p>
          ) : (
            filtered.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                editingId={editingId}
                editingText={editingText}
                onEditingTextChange={onEditingTextChange}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

// Memoize to prevent re-renders when parent re-renders but props haven't changed
export default React.memo(TaskList);
