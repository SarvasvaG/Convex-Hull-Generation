# 🚀 Quick Start Guide

## GroupID-3 - Convex Hull Visualization

### First Time Setup

1. **Install Dependencies** (only needed once)

   ```bash
   .\install.bat
   ```

2. **Start Development Server**

   ```bash
   .\start-dev.bat
   ```

3. **Open Browser**
   - Go to: http://localhost:5173

### Using the Application

1. Enter number of points (3-100)
2. Click "Generate Points"
3. Use slider or "Play" button to visualize
4. Watch the Jarvis March algorithm build the convex hull!

### Troubleshooting

**PowerShell Script Errors?**

- Use the `.bat` files instead
- Or run: `cmd /c "npm run dev"`

**Port Already in Use?**

- Vite will automatically use next available port

**Need to Reinstall?**

- Delete `node_modules` folder
- Run `.\install.bat` again

---

## 📁 Important Files

- `src/utils/geometry.js` - Jarvis March algorithm
- `src/components/Canvas.jsx` - Visualization
- `src/components/Controls.jsx` - UI controls
- `src/App.jsx` - Main application
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Complete project overview

---

## 🎯 Features

✅ Random point generation
✅ Step-by-step visualization
✅ Animation playback
✅ Interactive controls
✅ Real-time statistics
✅ Beautiful modern UI

---

**Team:** Raman Sharma, Ayush Ranjan, Sarvasva Gupta
**Date:** October 15, 2025
**Status:** ✅ COMPLETE & RUNNING
