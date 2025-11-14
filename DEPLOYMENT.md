# Deployment Guide

Aplikasi TodoApp siap untuk production! Panduan ini mencakup build, optimization, dan deployment ke berbagai platform.

## Pre-Deployment Checklist

- [x] All features implemented (CRUD, undo/redo, dark mode, search, recurring, notifications, tags, Firebase sync)
- [x] Responsive design (mobile-first, 3 breakpoints)
- [x] Keyboard shortcuts (Ctrl+D, Ctrl+Z, Ctrl+Shift+Z, Escape, Enter)
- [x] Dark mode with persistence
- [x] Cloud sync with Firebase (optional setup)
- [x] Performance optimizations (React.memo, component splitting)
- [x] History persistence (undo/redo saved to localStorage)
- [x] Error handling and offline mode
- [x] Documentation complete

## Build for Production

```bash
npm run build
```

Hasil: folder `build/` dengan production bundle (optimized, minified).

**Build output:**
- `build/index.html` — HTML template
- `build/static/js/` — Minified JS chunks
- `build/static/css/` — Minified CSS
- `build/favicon.ico` — Favicon

## Deployment Options

### 1. Vercel (Recommended - Fastest & Easiest)

Vercel auto-deploys dari Git dan optimize React apps.

**Steps:**
1. Push kode ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TodoApp with all features"
   git remote add origin https://github.com/YOUR_USERNAME/TodoApp.git
   git branch -M main
   git push -u origin main
   ```

2. Buka https://vercel.com
3. Import project dari GitHub
4. Set environment variables di Vercel Dashboard:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. Click "Deploy"

**URL:** `https://todoapp-[random].vercel.app`

**Advantages:**
- Zero config
- Auto-deploy on git push
- Free tier generous
- Fast CDN

### 2. Netlify

Similar to Vercel, fokus pada JAMstack.

**Steps:**
1. Push ke GitHub (sama seperti Vercel)
2. Buka https://netlify.com
3. Click "New site from Git"
4. Select repository
5. Build command: `npm run build`
6. Publish directory: `build`
7. Add environment variables di Site settings
8. Deploy

**URL:** `https://[site-name].netlify.app`

**Advantages:**
- Form handling built-in
- Serverless functions support
- Free tier dengan bandwidth unlimited

### 3. GitHub Pages

Free hosting dari GitHub, tapi setup sedikit lebih kompleks.

**Steps:**
1. Add ke `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/TodoApp"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add scripts ke `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Buka Settings → Pages → Set branch ke `gh-pages`

**URL:** `https://YOUR_USERNAME.github.io/TodoApp`

**Advantages:**
- Absolutely free
- Terintegrasi dengan GitHub
- Version control built-in

**Disadvantages:**
- Static only (no server-side rendering)
- Slow untuk update besar

### 4. Self-Hosted (AWS, DigitalOcean, Linode)

Untuk kontrol penuh, beli server sendiri.

**Steps (AWS S3 + CloudFront):**
1. Create S3 bucket:
   ```bash
   aws s3 mb s3://todoapp-bucket
   ```

2. Build & upload:
   ```bash
   npm run build
   aws s3 sync build/ s3://todoapp-bucket/
   ```

3. Setup CloudFront CDN pointing to S3 bucket

**URL:** `https://d123abc.cloudfront.net`

**Advantages:**
- Full control
- Scalable
- Custom domain
- Advanced analytics

**Disadvantages:**
- Biaya (though reasonable for low traffic)
- Setup lebih kompleks

## Post-Deployment

### 1. Setup Custom Domain

#### Vercel:
1. Dashboard → Project Settings → Domains
2. Add custom domain
3. Update DNS records (Vercel akan tunjukin config)

#### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Update DNS (atau pakai Netlify DNS)

#### GitHub Pages:
1. Add `CNAME` file di repo root dengan domain
2. Update DNS records

### 2. Enable HTTPS (Auto-enabled di Vercel/Netlify)

Self-hosted: gunakan Let's Encrypt (free SSL).

### 3. Setup Analytics (Optional)

```html
<!-- Google Analytics (add to public/index.html) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 4. Monitor Performance

- Vercel: Analytics tab
- Netlify: Analytics menu
- Google Analytics: dashboard
- Lighthouse (DevTools) untuk audit

## Environment Variables

Pastikan `.env` file tidak di-commit (sudah ada di `.gitignore`).

Production values harus di-set di platform deployment settings, bukan di `.env`.

```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
...
```

## Performance Tips

### Bundle Size Optimization

Check bundle size:
```bash
npm install -g webpack-bundle-analyzer
npm run build
npm analyze
```

Current optimizations:
- ✅ Code splitting (components)
- ✅ React.memo (prevent re-renders)
- ✅ Tree-shaking (unused code removal)
- ✅ Minification (production build)

### Caching Strategy

App already uses:
- ✅ localStorage for tasks, history, dark mode
- ✅ Browser cache headers (Vercel/Netlify auto-config)

### Security

- ✅ No sensitive data in code
- ✅ Firebase security rules (set properly in Firestore)
- ✅ HTTPS enforced (auto on Vercel/Netlify)
- ✅ Content Security Policy headers (optional, add if needed)

## SEO (Optional)

Add meta tags ke `public/index.html`:

```html
<meta name="description" content="Modern, offline-capable todo app with cloud sync, dark mode, and recurring tasks.">
<meta name="keywords" content="todo, task, app, productivity, offline">
<meta name="og:title" content="TodoApp">
<meta name="og:description" content="Your awesome todo app">
<meta name="og:image" content="https://your-domain.com/og-image.png">
```

## Monitoring & Updates

### Check Deployment Status

```bash
# Vercel
vercel inspect

# Netlify
netlify status
```

### Update Deploy Process

App auto-deploys on git push (if using Vercel/Netlify).

Manual update:
```bash
npm run build
# Upload build/ folder to server
```

## Troubleshooting

### "Blank page" after deploy

**Cause:** Asset paths wrong

**Solution:**
- Check `public/index.html` for correct paths
- Verify `build/` folder exists
- Clear cache and rebuild

### Firebase not working

**Cause:** Wrong `.env` config or security rules

**Solution:**
- Verify `REACT_APP_FIREBASE_*` in platform settings
- Check Firestore rules allow read/write
- Check browser console for errors

### Slow app after deploy

**Cause:** Large bundle or bad CDN

**Solution:**
- Run `npm analyze` to check bundle size
- Lazy-load heavy components if needed
- Use Vercel/Netlify CDN for faster delivery

## Next Steps

1. **Choose hosting:** Vercel (easiest) or Netlify
2. **Push to GitHub**
3. **Deploy:** Click "Deploy" in platform
4. **Set env vars:** Add Firebase config
5. **Test:** Open app, add tasks, check sync
6. **Share:** Send URL to friends!

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages Docs](https://pages.github.com/)
- [Firebase Deploy Guide](https://firebase.google.com/docs/hosting)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

**Selamat! App kamu siap production! 🚀**
