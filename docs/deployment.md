# Render.com Deployment Instructions

## Backend Deployment on Render.com

### Step 1: Create a New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `TruEstate_Assignment` repository

### Step 2: Configure the Service

| Setting | Value |
|---------|-------|
| **Name** | `truestate-api` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 3: Set Environment Variables

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add the following variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |

> ⚠️ **Important**: Replace the MongoDB URI with your actual connection string from MongoDB Atlas.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete
3. Your API will be available at: `https://truestate-api.onrender.com`

---

## Frontend Deployment on Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Update API URL

Before deploying, update the API URL in `frontend/src/App.jsx`:

```javascript
// Change from:
const API_BASE_URL = 'http://localhost:5000/api';

// To your Render backend URL:
const API_BASE_URL = 'https://your-backend-name.onrender.com/api';
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Click **"Deploy"**

**Option B: Using CLI**
```bash
cd frontend
vercel
```

### Step 4: Environment Variables (if needed)

In Vercel Dashboard:
1. Go to your project settings
2. Click **"Environment Variables"**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-name.onrender.com/api` |

Then update your code to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## CORS Configuration for Production

Update `backend/index.js` to allow your Vercel frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

---

## Verification Checklist

- [ ] Backend deployed on Render.com
- [ ] `MONGODB_URI` environment variable set
- [ ] Frontend deployed on Vercel
- [ ] API URL updated in frontend code
- [ ] CORS configured for production
- [ ] Both apps communicating successfully
