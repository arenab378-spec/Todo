# Features Summary

TodoApp adalah aplikasi **to-do modern, offline-capable, dan real-time** dengan dukungan cloud sync, dark mode, recurring tasks, dan banyak lagi.

## Core Features

### ✅ Task Management
- **Add tasks** — Input text + optional due date, recurrence, tags
- **Edit tasks** — Double-click untuk inline edit, Escape untuk cancel
- **Delete tasks** — Trash icon atau undo setelah delete
- **Complete tasks** — Checkbox toggle; recurring tasks auto-generate next occurrence
- **Drag & drop** — Reorder tasks; perubahan otomatis di-save

### ✅ Filters & Search
- **Status filters** — All, Active, Completed
- **Tag filtering** — Filter by categories (comma-separated tags on add)
- **Text search** — Real-time search filter di top bar

### ✅ Advanced Features

#### Recurring Tasks
- **Options:** None, Daily, Weekly, Monthly
- **Auto-generation:** Saat task recurring di-complete, next occurrence langsung dibuat
- **Timezone-aware:** Gunakan format datetime-local

#### Due Dates & Reminders
- **Due date picker** — HTML5 datetime-local input
- **Browser notifications** — 30-second poll, notify saat task overdue
- **Timezone support** — Browser localizes timestamps

#### Dark Mode
- **Toggle:** Button di top-right (☀️/🌙) atau Ctrl+D
- **Persistence:** Saved to localStorage, loads on refresh
- **Complete theming:** Background, text, inputs, badges all themed

#### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Enter` | Add task (when in input) |
| `Ctrl+D` / `Cmd+D` | Toggle dark mode |
| `Ctrl+Z` / `Cmd+Z` | Undo last change |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Escape` | Cancel edit mode |
| Double-click task | Edit inline |

#### Undo/Redo
- **Full history:** Stack-based, supports 99 past states
- **Persistent:** History saved to localStorage
- **Operations tracked:** Add, edit, delete, complete, drag-reorder all undoable
- **Visual feedback:** Undo/Redo buttons disabled when not available

### ✅ Cloud Sync (Firebase)

#### Real-Time Synchronization
- **Anonymous auth** — No signup needed, unique user ID generated
- **Firestore storage** — Tasks stored per-user collection
- **Real-time listeners** — Instant sync across devices
- **Offline mode** — App works offline, auto-syncs when online

#### Sync Status Indicators
- **⟳ Syncing...** — Uploading to cloud
- **✅ Synced** — All data in sync
- **⚠️ Sync Error** — Connection/permission issue (still works offline)
- **📶 Offline Mode** — Internet disconnected
- **👤 User ID** — Shows anonymous user identifier

#### Setup
1. Create Firebase project (free tier included)
2. Enable Firestore Database (test mode for dev, secure rules for prod)
3. Enable Anonymous Authentication
4. Add config to `.env`
5. App auto-syncs on start and changes

See `FIREBASE_SETUP.md` for detailed steps.

### ✅ Data Persistence

#### localStorage
- **Tasks:** Saved immediately on change
- **History:** Undo/redo stack persisted
- **Theme:** Dark mode preference
- **Survives:** Browser refresh, offline periods

#### Firestore (optional)
- **Cloud backup:** Tasks backed up in Firebase
- **Multi-device:** Same tasks on phone, laptop, tablet
- **Version history:** Firestore keeps revisions (can restore)

## UI/UX Features

### Responsive Design
- **Mobile-first:** Optimized for <480px phones
- **Tablets:** 481-768px optimized layout
- **Desktop:** >769px full width (capped at 700px for readability)
- **Touch-friendly:** 44px min-height buttons, no hover-only UX

### Visual Polish
- **Smooth animations:** 0.2-0.3s transitions
- **Emoji icons:** 📝 tasks, 🎯 empty state, ↶/↷ undo/redo, etc.
- **Color-coded badges:** Green (synced), yellow (syncing), red (error), gray (offline)
- **Gradient backgrounds:** Light (purple gradient) & dark (dark gradient)

### Accessibility
- **Keyboard navigation:** All features keyboard-accessible
- **Semantic HTML:** Proper labels, alt text
- **Color contrast:** WCAG AA compliant
- **Focus indicators:** Clear visual feedback

## Performance Optimizations

### Code Splitting
- **Component architecture:** 6 separate components (TaskItem, TaskList, Toolbar, TopBar, InputContainer, SyncStatus)
- **React.memo:** All components memoized to prevent unnecessary re-renders
- **Lazy evaluation:** Filtered tasks computed only on render

### Bundle Size
- **Minified:** Production build optimized
- **Tree-shaking:** Unused code removed
- **dependencies:** Lean stack (date-fns, @hello-pangea/dnd, firebase, rrule)

### Runtime Performance
- **localStorage caching:** Instant load for tasks + history
- **Efficient state:** Batched updates, no redundant re-renders
- **Notification polling:** 30-second intervals (not every second)

## Technical Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React 18 + Hooks |
| **Build Tool** | Create React App (webpack) |
| **Styling** | CSS3 (mobile-first, media queries) |
| **State** | useState + localStorage |
| **Dates** | date-fns |
| **Drag-Drop** | @hello-pangea/dnd (accessible) |
| **Cloud** | Firebase (Firestore + Auth) |
| **Deployment** | Vercel / Netlify / GitHub Pages |

## Data Model

```javascript
Task {
  id: number,              // Timestamp-based unique ID
  text: string,            // Task description
  completed: boolean,      // Completion status
  due: ISO8601 | null,     // Due datetime (ISO string)
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly',
  notified: boolean,       // Has notification been sent
  tags: string[],          // Categories (comma-separated input)
  firestoreId: string,     // Firestore doc ID (if synced)
  createdAt: Date,         // (Server timestamp)
  syncedAt: Date           // (Server timestamp)
}
```

## Limitations & Future Work

### Current Limitations
- ❌ No offline editing conflict resolution (last-write-wins)
- ❌ No collaboration (single-user per anonymous ID)
- ❌ No subtasks/nesting
- ❌ No file attachments
- ❌ No calendar view
- ❌ No export/import (can add via localStorage dumps)
- ❌ No notifications on other tabs (single-tab only)

### Roadmap (Future Features)
1. **Advanced sync:** Conflict resolution, multi-user sharing
2. **Calendar view:** Monthly/weekly calendar visualization
3. **Subtasks:** Hierarchical task structure
4. **Email reminders:** Send email reminder at due time
5. **PWA:** Install as native app
6. **Statistics:** Productivity insights & charts
7. **Import/Export:** JSON/CSV backup
8. **Plugins:** Custom filters, custom actions

## Security

### Current Security Posture
- ✅ **Anonymous auth** — No passwords stored
- ✅ **HTTPS only** — Enforced on Vercel/Netlify
- ✅ **localStorage isolation** — Per-browser
- ✅ **No analytics tracking** — Optional (not enabled)

### Production Recommendations
1. **Firestore Security Rules:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/tasks/{document=**} {
         allow read, write: if request.auth.uid == userId;
       }
     }
   }
   ```

2. **Environment variables** — Never commit `.env` (already in .gitignore)
3. **Rate limiting** — Add to Firebase if expecting high traffic
4. **Data retention** — Firestore auto-deletes inactive users after 30 days (free tier default)

## Testing

### Manual Test Checklist
- [ ] Add task with text
- [ ] Add task with due date
- [ ] Add recurring task (daily) → mark complete → verify next occurrence
- [ ] Add tags, filter by tag
- [ ] Edit task (double-click)
- [ ] Delete task (trash icon)
- [ ] Undo delete (Ctrl+Z)
- [ ] Redo (Ctrl+Shift+Z)
- [ ] Search (type in search bar)
- [ ] Toggle dark mode (button or Ctrl+D)
- [ ] Drag task to reorder
- [ ] Enable notifications → wait → check browser notification
- [ ] Refresh page → verify tasks load
- [ ] Disconnect internet → verify offline badge
- [ ] Reconnect → verify sync badge

### Automated Tests (TODO)
- Unit tests for history (undo/redo)
- Integration tests for Firebase sync
- E2E tests with Cypress/Playwright

## Support & Contribution

### Report Issues
Open GitHub Issues for bugs or feature requests.

### Contribute
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and open PR
5. Maintainer reviews and merges

## License

MIT License — Free to use for personal & commercial projects.

---

**Enjoy TodoApp! Let us know your feedback.** 🎉
