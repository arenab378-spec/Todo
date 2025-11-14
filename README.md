# 📝 TodoApp — Modern, Offline-Capable To-Do App

A feature-rich, production-ready to-do application built with React 18, Firebase, and modern web APIs. **Fully offline-capable** with real-time cloud sync, dark mode, recurring tasks, and keyboard shortcuts.

**🌐 [Live Demo](#deployment)** | **📖 [Full Features](FEATURES.md)** | **🚀 [Deploy Guide](DEPLOYMENT.md)** | **🔥 [Firebase Setup](FIREBASE_SETUP.md)**

---

## ⚡ Quick Start

### Install
```bash
npm install
```

### Development
```bash
npm start
```
Open http://localhost:3000 in your browser.

### Build for Production
```bash
npm run build
```
Output: optimized bundle in `build/` folder, ready to deploy.

---

## ✨ Features

### 🎯 Core
- ✅ **Add/Edit/Delete** tasks with inline editing
- ✅ **Drag & drop** reordering
- ✅ **Undo/Redo** — Full history with Ctrl+Z / Ctrl+Shift+Z
- ✅ **Task completion** with auto-generation for recurring tasks
- ✅ **Search** real-time filter by task text
- ✅ **Filters** — All, Active, Completed, or by tag

### 🔄 Advanced
- ✅ **Recurring tasks** — Daily, weekly, monthly auto-generation
- ✅ **Due dates & reminders** — Browser notifications when overdue
- ✅ **Tags/Categories** — Comma-separated input, filter by category
- ✅ **Dark mode** — Toggle via button or Ctrl+D, persists across refreshes
- ✅ **Keyboard shortcuts** — Enter (add), Escape (cancel), Ctrl+Z (undo), etc.

### ☁️ Cloud & Offline
- ✅ **Firebase Cloud Sync** — Real-time multi-device sync
- ✅ **Offline mode** — Works fully offline, auto-syncs when online
- ✅ **localStorage** — All data persisted locally for instant load
- ✅ **History persistence** — Undo/redo history saved across sessions

### 📱 UX/Design
- ✅ **Mobile-first responsive** — Optimized for phones, tablets, desktops
- ✅ **Touch-friendly UI** — 44px buttons, optimized for touch
- ✅ **Smooth animations** — 0.2-0.3s transitions throughout
- ✅ **Accessibility** — Keyboard navigation, semantic HTML, WCAG AA contrast

---

## 🎮 Usage

### Add a Task
1. Type in the input field
2. Optionally set: Due date, Recurrence, Tags
3. Click "Tambah" or press Enter

### Edit a Task
1. Double-click the task text
2. Edit and press Enter, or click outside

### Delete a Task
1. Click the trash icon (🗑️)
2. Or press Ctrl+Z after delete to undo

### Undo/Redo
- **Undo:** Ctrl+Z (or Cmd+Z on Mac) or click ↶ button
- **Redo:** Ctrl+Shift+Z (or Cmd+Shift+Z) or click ↷ button

### Toggle Dark Mode
- Click the 🌙 button (top-right)
- Or press Ctrl+D

### Search Tasks
- Type in the search bar (🔍)
- Tasks filter in real-time

### Set Reminders
- Click "Enable Reminders" button
- App will notify when task is overdue (browser notification)

### Cloud Sync (Optional)
1. Get Firebase config (see `FIREBASE_SETUP.md`)
2. Add to `.env` file
3. Tasks auto-sync to cloud with real-time updates

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with Hooks |
| **CRA (webpack)** | Build & dev server |
| **date-fns** | Date manipulation & formatting |
| **@hello-pangea/dnd** | Accessible drag-and-drop |
| **Firebase** | Cloud sync (optional) |
| **CSS3** | Mobile-first responsive design |

---

## 📁 Project Structure

```
src/
  ├── App.js                 # Main component, state management, logic
  ├── App.css                # Global styles (responsive, dark mode)
  ├── index.js               # React DOM entry point
  ├── firebase.js            # Firebase config & helpers
  └── components/
      ├── SyncStatus.js      # Cloud sync status badges
      ├── TopBar.js          # Search & dark mode toggle
      ├── InputContainer.js  # Task input form
      ├── Toolbar.js         # Filters, undo/redo buttons, reminders
      ├── TaskList.js        # Droppable task list container
      └── TaskItem.js        # Individual task with drag handle

public/
  └── index.html             # HTML template

build/                        # Production output (after npm run build)
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

For cloud sync, add Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

See `FIREBASE_SETUP.md` for step-by-step Firebase setup.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Add task (when input focused) |
| `Ctrl+D` / `Cmd+D` | Toggle dark mode |
| `Ctrl+Z` / `Cmd+Z` | Undo last change |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Escape` | Cancel inline edit |
| Double-click | Edit task inline |

---

## 📱 Responsive Design

App is fully responsive across all devices:

- **Mobile** (<480px): Compact layout, touch-friendly buttons
- **Tablet** (481-768px): Balanced spacing, medium buttons
- **Desktop** (>769px): Full-width (capped at 700px), larger spacing

Tested on: iPhone, iPad, Android phones, Windows/Mac/Linux desktops.

---

## 🚀 Deployment

App is production-ready and can be deployed to:

- **Vercel** (recommended) — Zero-config, auto-deploys from GitHub
- **Netlify** — JAMstack hosting, fast CDN
- **GitHub Pages** — Free, static hosting
- **Custom server** — Serve `build/` folder with any static host

See `DEPLOYMENT.md` for detailed step-by-step guides for each platform.

### Quick Deploy to Vercel

```bash
# 1. Build
npm run build

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel --prod
```

---

## 📊 Features Roadmap

### Current ✅
- Task CRUD with all bells & whistles
- Undo/redo with persistence
- Dark mode & responsive design
- Firebase cloud sync
- Recurring tasks & notifications
- Search, tags, filters
- Keyboard shortcuts

### Planned 🎯
- Calendar view
- Subtasks / task hierarchy
- Multi-user collaboration
- Email reminders
- PWA (install as app)
- Productivity statistics
- Import/Export (JSON, CSV)
- Custom themes

---

## 🐛 Troubleshooting

### App loads blank
- **Check:** Browser console (F12) for errors
- **Rebuild:** `npm start` should auto-reload
- **Clear cache:** Ctrl+Shift+Delete, clear all data

### Cloud sync not working
- **Check:** `.env` has correct Firebase config
- **Verify:** Firebase project has Firestore DB enabled & Anonymous Auth on
- **Console:** Look for error messages
- See `FIREBASE_SETUP.md` for troubleshooting

### Slow performance
- **Check:** Browser DevTools > Lighthouse audit
- **Optimize:** Large task lists may need pagination (future feature)
- **Clear:** localStorage if too much history (Settings > Clear All)

### Tasks not persisting
- **Check:** Browser privacy/incognito mode — localStorage may be disabled
- **Verify:** localStorage quota not exceeded (usually 5-10MB available)
- **Fallback:** Enable cloud sync for automatic backup

---

## 📝 Notes

- App uses **localStorage** by default for instant load (no server required)
- **Cloud sync is optional** — App works great offline-only if Firebase not configured
- **History limit:** 99 past states (undo/redo stack)
- **Notifications:** Requires browser permission; check browser notification settings

---

## 📄 License

MIT License — Free to use for personal and commercial projects.

---

## 👨‍💻 Development

### Start Dev Server
```bash
npm start
```
Open http://localhost:3000

### Build Production Bundle
```bash
npm run build
```

### Run Linter (Optional)
```bash
npm run lint
```

### Analyze Bundle Size (Optional)
```bash
npm install -g webpack-bundle-analyzer
npm run build
npm analyze
```

---

## 📚 Documentation

- **[FEATURES.md](FEATURES.md)** — Detailed feature list & technical specs
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** — Cloud sync configuration guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Deploy to Vercel, Netlify, GitHub Pages, etc.

---

## 🤝 Contributing

Found a bug or want to suggest a feature? Open an issue on GitHub!

To contribute:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Open a pull request

---

## 💬 Feedback

Love the app? Star ⭐ the GitHub repo or share with friends!

Have suggestions? Open an issue or reach out via email.

---

**Made with ❤️ for productive people who love keyboard shortcuts and dark mode.** 🌙

Happy task management! 📝✨

A modern, feature-rich todo list application built with React. Manage tasks efficiently with recurring reminders, tags, dark mode, and responsive mobile UI.

## ✨ Features

### Core Features
- ✅ **Add/Edit/Delete Tasks** - Create, modify, and remove tasks easily
- ✅ **Task Completion** - Mark tasks as done with visual feedback
- ✅ **Persistent Storage** - All data saved to browser localStorage
- ✅ **Local Persistence** - Tasks sync across browser tabs

### Organization & Filtering
- 📂 **Tags/Categories** - Add comma-separated tags to organize tasks
- 🏷️ **Filter by Tags** - Click tags to view related tasks
- 🔍 **Search** - Find tasks by text (case-insensitive)
- ✔️ **Status Filters** - View All, Active, or Completed tasks

### Scheduling & Reminders
- 📅 **Due Dates** - Set optional due date and time for each task
- 🔄 **Recurring Tasks** - Automatically repeat daily, weekly, or monthly
- 🔔 **Browser Notifications** - Get notified when tasks are due (requires browser permission)
- ⏰ **Smart Recurrence** - Completing a recurring task auto-generates the next occurrence

### Advanced UX
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ♿ **Keyboard Shortcuts** - 
  - `Ctrl+D` / `Cmd+D` - Toggle dark mode
  - `Escape` - Cancel task edit
- 🎯 **Drag & Drop** - Reorder tasks by dragging
- ⌨️ **Double-click Edit** - Double-click task text to edit inline

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

```bash
# Clone or navigate to project
cd /home/tiny/Desktop/TodoApp

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📖 Usage

### Adding a Task
1. Type task name in the input field
2. (Optional) Pick a due date/time
3. (Optional) Choose recurrence (None, Daily, Weekly, Monthly)
4. (Optional) Add tags (comma-separated: "work,urgent")
5. Click **Tambah** or press **Enter**

### Managing Tasks
- **Complete**: Click checkbox to mark done
- **Edit**: Double-click task text to edit inline; press Enter or click away to save
- **Delete**: Click 🗑️ button
- **Reorder**: Drag tasks up/down
- **Filter by tag**: Click a tag badge in toolbar to show only tasks with that tag
- **Search**: Type in search box to filter by text

### Recurring Tasks
- Set recurrence when creating task
- When you mark a recurring task complete, the next occurrence is auto-created
- Due date advances by the recurrence interval (daily +1d, weekly +1w, monthly +1m)

### Notifications
- Click **Enable Reminders** to request browser notification permission
- When a task's due time passes, you'll receive a notification
- Notifications check every 30 seconds while app is open

### Dark Mode
- Click 🌙/☀️ button in top-right to toggle dark mode
- Preference is saved automatically
- Shortcut: `Ctrl+D` (or `Cmd+D` on Mac)

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Scripts** - CRA build tool
- **date-fns** - Date manipulation & formatting
- **@hello-pangea/dnd** - Drag & drop reordering
- **localStorage API** - Client-side persistence
- **Notification API** - Browser notifications

## 📦 Project Structure

```
src/
├── App.js          # Main component (all logic & rendering)
├── App.css         # Styling (responsive, dark mode)
└── index.js        # React DOM entry point

public/
└── index.html      # HTML template

package.json        # Dependencies & scripts
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Add new task (from input field) |
| `Escape` | Cancel inline edit |
| `Ctrl+D` / `Cmd+D` | Toggle dark mode |

## 📱 Responsive Breakpoints

- **Mobile** (< 480px): Compact layout, smaller fonts, stacked inputs
- **Tablet** (481-768px): Balanced spacing
- **Desktop** (> 769px): Full layout, larger inputs

Touch-friendly buttons (min 44px height) on mobile devices.

## 🎨 Customization

### Change Theme Colors
Edit `src/App.css` gradient in `body`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Notification Interval
In `src/App.js`, find the notification effect and change `30000` (30 seconds):
```javascript
timer = setInterval(() => { ... }, 30000);
```

## 🗺️ Roadmap

- [ ] Cloud sync (Firebase Firestore)
- [ ] Undo/redo functionality
- [ ] Advanced filtering (by due date, completion status)
- [ ] Export/import tasks (JSON, CSV)
- [ ] Weekly planner view
- [ ] Subtasks support
- [ ] Priority levels
- [ ] Due date templates (Today, Tomorrow, This Week)
- [ ] PWA support (offline, installable)

## 📄 License

Open source - free to use and modify.

## 💡 Tips

- **Organize with tags**: Use consistent tags like "work", "personal", "urgent" for better filtering
- **Use recurring tasks**: Setup daily/weekly tasks once instead of manually adding them
- **Enable notifications**: Get reminders for important deadlines
- **Dark mode at night**: Easier on the eyes during evening/night usage
- **Mobile-friendly**: The app works great on phone—bookmark it for quick access

## 🐛 Troubleshooting

**Tasks not saving?**
- Check if localStorage is enabled in your browser
- Clear browser cache if tasks disappear

**Notifications not working?**
- Ensure you click "Allow" when browser asks for permission
- Browser/tab must be open for notifications to trigger
- Check browser notification settings (Settings > Notifications)

**Dark mode not persisting?**
- Browser might have private/incognito mode enabled (localStorage disabled)
- Try in normal browsing mode

## 🤝 Contributing

Feel free to fork and improve! Some ideas:
- Multi-user sync
- Time zone support
- Productivity stats & charts
- Mobile app (React Native)

---

**Built with ❤️ using React**
