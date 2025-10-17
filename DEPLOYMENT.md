# Go Together - Deployment Guide

## ✅ Current Status
The authentication system is **working locally** and ready for deployment!

## 🚀 Quick Deploy to Vercel

1. **Build the project** (already done):
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import this repository
   - Vercel will automatically detect the build settings from `vercel.json`

## 🌐 Deploy to Netlify

1. **Build the project** (already done):
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder to deploy
   - Or connect your GitHub repository

## 📁 What's Ready for Deployment

- ✅ **Built files** in `dist/` directory
- ✅ **Demo mode** automatically detects Vercel/Netlify deployment
- ✅ **Mock authentication** for demo (email: demo@example.com, password: demo123)
- ✅ **Fallback to real API** when running locally

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `netlify.toml` - Netlify deployment configuration
- `package.json` - Build scripts and dependencies

## 🎯 Demo Features

When deployed to Vercel/Netlify, the app will:
- Show a "Demo Mode" notice
- Pre-fill login credentials
- Use mock data for trips and user info
- Display a note that full features are available locally

## 🏠 Local Development

To run locally with full backend:
```bash
npm run dev
```

This starts both the frontend (port 8080) and backend (port 3000) with full database functionality.

## 📝 Notes

- The deployment uses a frontend-only approach with mock data
- Local development uses the full Node.js backend with SQLite database
- Authentication works in both modes (real vs demo)
