import React from 'react';

const InputContainer = ({
  inputText,
  onInputChange,
  onInputKeyPress,
  dueInput,
  onDueChange,
  recurrenceInput,
  onRecurrenceChange,
  tagInput,
  onTagChange,
  onAddTask
}) => {
  return (
    <div className="inputContainer">
      <input
        type="text"
        placeholder="Tambah tugas baru..."
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={onInputKeyPress}
        className="input"
      />
      <input
        type="datetime-local"
        value={dueInput}
        onChange={(e) => onDueChange(e.target.value)}
        className="dueInput"
        title="Tanggal dan waktu tenggat (opsional)"
      />
      <select
        value={recurrenceInput}
        onChange={(e) => onRecurrenceChange(e.target.value)}
        className="selectRecurrence"
      >
        <option value="none">No Repeat</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tagInput}
        onChange={(e) => onTagChange(e.target.value)}
        className="tagInput"
      />
      <button onClick={onAddTask} className="addBtn">
        Tambah
      </button>
    </div>
  );
};

export default React.memo(InputContainer);
