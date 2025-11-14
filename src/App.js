import React, { useState, useEffect } from 'react';
import { isBefore, parseISO, addDays, addWeeks, addMonths } from 'date-fns';
import { DragDropContext } from '@hello-pangea/dnd';
import { initAuth, onAuthChange, subscribeToTasks, addTaskToFirestore, updateTaskInFirestore, deleteTaskFromFirestore } from './firebase';

import SyncStatus from './components/SyncStatus';
import TopBar from './components/TopBar';
import InputContainer from './components/InputContainer';
import Toolbar from './components/Toolbar';
import TaskList from './components/TaskList';

function App() {
  // Input states
  const [inputText, setInputText] = useState('');
  const [dueInput, setDueInput] = useState('');
  const [recurrenceInput, setRecurrenceInput] = useState('none');
  const [tagInput, setTagInput] = useState('');

  // Task states
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  // History for undo/redo
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);

  // Filter states
  const [filter, setFilter] = useState('all');
  const [filterTag, setFilterTag] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Feature states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('todoapp_darkmode') === 'true';
    } catch { return false; }
  });

  // Firebase states
  const [userId, setUserId] = useState(null);
  const [syncStatus, setSyncStatus] = useState('syncing');
  const [offlineMode, setOfflineMode] = useState(false);

  // Get unique tags from all tasks
  const allTags = [...new Set(tasks.flatMap(t => t.tags || []))];

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('todoapp_tasks');
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load tasks', e);
    }
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const past = localStorage.getItem('todoapp_history_past');
      const future = localStorage.getItem('todoapp_history_future');
      if (past) setHistoryPast(JSON.parse(past));
      if (future) setHistoryFuture(JSON.parse(future));
    } catch (e) {
      console.warn('Failed to load history', e);
    }
  }, []);

  // Persist history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('todoapp_history_past', JSON.stringify(historyPast));
      localStorage.setItem('todoapp_history_future', JSON.stringify(historyFuture));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  }, [historyPast, historyFuture]);

  // Initialize Firebase and auth
  useEffect(() => {
    initAuth();
    onAuthChange((user) => {
      if (user) {
        console.log('🔐 Logged in as:', user.uid);
        setUserId(user.uid);
        setSyncStatus('syncing');
      }
    });
  }, []);

  // Subscribe to Firestore tasks when user logs in
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribe = subscribeToTasks(userId, (firestoreTasks) => {
      console.log('📥 Synced tasks from Firestore:', firestoreTasks);
      setTasks(firestoreTasks);
      setSyncStatus('synced');
      setOfflineMode(false);
    });
    
    return () => unsubscribe && unsubscribe();
  }, [userId]);

  // Persist tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('todoapp_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  }, [tasks]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('todoapp_darkmode', darkMode);
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+D or Cmd+D = toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDarkMode(prev => !prev);
      }
      // Ctrl+Z = Undo ; Ctrl+Shift+Z = Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      // Escape = cancel edit
      if (e.key === 'Escape' && editingId) {
        setEditingId(null);
        setEditingText('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingId]);

  // Notifications: request permission and periodically check due tasks
  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Browser Anda tidak mendukung Notification API');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationsEnabled(true);
      } else {
        alert('Izin notifikasi ditolak atau dibatalkan');
      }
    } catch (e) {
      console.warn('Notification permission error', e);
    }
  };

  useEffect(() => {
    let timer = null;
    if (notificationsEnabled) {
      // check every 30s
      timer = setInterval(() => {
        const now = new Date();
        setTasks(prev => prev.map(t => {
          if (t.due && !t.completed && !t.notified) {
            let dueDate;
            try { dueDate = parseISO(t.due); } catch { return t; }
            if (dueDate.getTime() <= now.getTime()) {
              try {
                if (Notification.permission === 'granted') {
                  /* eslint-disable no-new */
                  const { format } = require('date-fns');
                  new Notification(`Tugas: ${t.text}`, { body: `Tenggat ${format(dueDate, 'Pp')}`, tag: `task-${t.id}` });
                }
              } catch (e) {
                console.warn('Failed sending notification', e);
              }
              return { ...t, notified: true };
            }
          }
          return t;
        }));
      }, 30000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [notificationsEnabled]);

  // Core task functions
  // History helpers for undo/redo
  const pushHistory = (prevTasks) => {
    setHistoryPast((h) => {
      const copy = h.slice(-98); // keep last 99
      return [...copy, prevTasks];
    });
  };

  const applyChange = (updater) => {
    setTasks((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { pushHistory(prev); } catch (e) { /* ignore */ }
      setHistoryFuture([]); // clear redo stack
      return next;
    });
  };

  const undo = () => {
    setHistoryPast((past) => {
      if (!past || past.length === 0) return past;
      const previous = past[past.length - 1];
      setHistoryFuture((f) => [tasks, ...f]);
      setTasks(previous);
      return past.slice(0, past.length - 1);
    });
  };

  const redo = () => {
    setHistoryFuture((future) => {
      if (!future || future.length === 0) return future;
      const nextState = future[0];
      setHistoryPast((p) => [...p, tasks]);
      setTasks(nextState);
      return future.slice(1);
    });
  };

  const addTask = () => {
    if (inputText.trim()) {
      const newTask = { 
        id: Date.now(), 
        text: inputText.trim(), 
        completed: false, 
        due: dueInput || null, 
        recurrence: recurrenceInput, 
        notified: false,
        tags: tagInput ? tagInput.split(',').map(t => t.trim()).filter(t => t) : []
      };
      
      // Try to sync to Firestore
      if (userId && !offlineMode) {
        addTaskToFirestore(newTask, userId)
          .then((docId) => {
            console.log('✅ Task synced to Firestore:', docId);
            setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, firestoreId: docId } : t));
          })
          .catch((err) => {
            console.warn('⚠️ Failed to sync task to Firestore:', err);
            setOfflineMode(true);
            setSyncStatus('error');
          });
      }

  applyChange(prev => [...prev, newTask]);
      setInputText('');
      setDueInput('');
      setRecurrenceInput('none');
      setTagInput('');
    } else {
      alert('Tulis dulu tugasnya!');
    }
  };

  const deleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (userId && task?.firestoreId && !offlineMode) {
      deleteTaskFromFirestore(userId, task.firestoreId)
        .catch((err) => {
          console.warn('⚠️ Failed to delete task from Firestore:', err);
          setOfflineMode(true);
          setSyncStatus('error');
        });
    }
  applyChange(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed && task.recurrence && task.recurrence !== 'none') {
      handleTaskComplete(id);
    } else {
      applyChange(prev => prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, completed: !t.completed };
          if (userId && t.firestoreId && !offlineMode) {
            updateTaskInFirestore(userId, t.firestoreId, updated)
              .catch((err) => {
                console.warn('⚠️ Failed to update task in Firestore:', err);
                setOfflineMode(true);
                setSyncStatus('error');
              });
          }
          return updated;
        }
        return t;
      }));
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) {
      setEditingId(null);
      setEditingText('');
      return;
    }
    applyChange(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, text: editingText.trim(), notified: t.due && isBefore(parseISO(t.due), new Date()) ? t.notified : false };
        if (userId && t.firestoreId && !offlineMode) {
          updateTaskInFirestore(userId, t.firestoreId, updated)
            .catch((err) => {
              console.warn('⚠️ Failed to update task in Firestore:', err);
              setOfflineMode(true);
              setSyncStatus('error');
            });
        }
        return updated;
      }
      return t;
    }));
    setEditingId(null);
    setEditingText('');
  };

  const clearCompleted = () => {
    applyChange(prev => prev.filter(t => !t.completed));
  };

  // Recurring task handler: when completed, generate next occurrence
  const handleTaskComplete = (id) => {
    applyChange(prev => {
      const result = [];
      prev.forEach(t => {
        if (t.id === id) {
          result.push({ ...t, completed: true });
          if (t.recurrence && t.recurrence !== 'none' && t.due) {
            try {
              const dueDate = parseISO(t.due);
              let nextDue = null;
              if (t.recurrence === 'daily') nextDue = addDays(dueDate, 1).toISOString();
              else if (t.recurrence === 'weekly') nextDue = addWeeks(dueDate, 1).toISOString();
              else if (t.recurrence === 'monthly') nextDue = addMonths(dueDate, 1).toISOString();
              if (nextDue) {
                result.push({
                  id: Date.now() + Math.random(),
                  text: t.text,
                  completed: false,
                  due: nextDue,
                  recurrence: t.recurrence,
                  notified: false,
                  tags: t.tags || []
                });
              }
            } catch (e) { console.warn('Recurrence calc error', e); }
          }
        } else {
          result.push(t);
        }
      });
      return result;
    });
  };

  // Filter logic
  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).filter(t => filterTag ? (t.tags && t.tags.includes(filterTag)) : true)
    .filter(t => searchText ? t.text.toLowerCase().includes(searchText.toLowerCase()) : true);

  const remaining = tasks.filter(t => !t.completed).length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="App">
      <h1>📝 To-Do List</h1>

      <SyncStatus syncStatus={syncStatus} offlineMode={offlineMode} userId={userId} />

      <TopBar
        searchText={searchText}
        onSearchChange={setSearchText}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(!darkMode)}
      />

      <InputContainer
        inputText={inputText}
        onInputChange={setInputText}
        onInputKeyPress={handleKeyPress}
        dueInput={dueInput}
        onDueChange={setDueInput}
        recurrenceInput={recurrenceInput}
        onRecurrenceChange={setRecurrenceInput}
        tagInput={tagInput}
        onTagChange={setTagInput}
        onAddTask={addTask}
      />

      <Toolbar
        filter={filter}
        onFilterChange={setFilter}
        allTags={allTags}
        filterTag={filterTag}
        onFilterTagChange={setFilterTag}
        remaining={remaining}
        onClearCompleted={clearCompleted}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => notificationsEnabled ? setNotificationsEnabled(false) : enableNotifications()}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyPast.length > 0}
        canRedo={historyFuture.length > 0}
      />

      <DragDropContext onDragEnd={(result) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.index === source.index) return;
        applyChange(prev => {
          const copy = Array.from(prev);
          const [moved] = copy.splice(source.index, 1);
          copy.splice(destination.index, 0, moved);
          return copy;
        });
      }}>
        <TaskList
          filtered={filtered}
          editingId={editingId}
          editingText={editingText}
          onEditingTextChange={setEditingText}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onToggleComplete={toggleComplete}
          onDeleteTask={deleteTask}
        />
      </DragDropContext>
    </div>
  );
}

export default App;
