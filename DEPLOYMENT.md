# TeamShop - Deployment Guide 🚀

## Quick Start: Deploy to Railway (Free!)

Railway.app is perfect for testing your app without needing a server or domain. It's **100% free** for small projects!

---

## Step 1: Prepare Your Code

### ✅ Configuration Files Created
All deployment files have been created for you:
- ✅ `Procfile` - Tells Railway how to run your app
- ✅ `build.sh` - Builds frontend and prepares static files
- ✅ `railway.json` - Railway configuration
- ✅ `.railwayignore` - Excludes unnecessary files
- ✅ Django configured with Whitenoise for static files
- ✅ Database configured to work with PostgreSQL or SQLite

### Test Locally First (Optional but Recommended)

```bash
# From project root
cd frontend
npm run build

cd ../backend
python manage.py collectstatic --noinput
python manage.py migrate

# Run with production-like settings
D

EBUG=False python manage.py runserver
```

---

## Step 2: Push to GitHub (Required for Railway)

Since your code is on GitLab, you have two options:

### Option A: Mirror to GitHub (Easiest)
1. Create a **free** GitHub account: https://github.com/signup
2. Create a new repository (name it `team-shop`)
3. Add GitHub as a remote:
```bash
cd /Users/teomaitrot/Documents/projet-perso/team-shop/teo21maitr-team-shop
git remote add github https://github.com/YOUR_USERNAME/team-shop.git
git push github main
```

### Option B: Use Railway CLI (Advanced)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## Step 3: Deploy to Railway

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with GitHub (it's free, no credit card needed!)

### 3.2 Deploy from GitHub
1. Click **"Deploy from GitHub repo"**
2. Select your `team-shop` repository
3. Railway will automatically detect it's a Django app!

### 3.3 Add PostgreSQL Database (Optional for production)
1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**  
3. Railway will automatically set the `DATABASE_URL` environment variable

### 3.4 Set Environment Variables
In Railway dashboard, go to **Variables** and add:

```bash
# Required
DEBUG=False
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
ALLOWED_HOSTS=team-shop.railway.app

# Optional - if you added PostgreSQL, this is automatic
# DATABASE_URL=(automatically set by Railway)

# CORS - Railway will provide you with a domain
CORS_ALLOWED_ORIGINS=https://team-shop.railway.app
```

To generate a secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3.5 Deploy!
1. Railway will automatically build and deploy
2. Wait 2-3 minutes for the build to complete
3. Click the generated URL (something like `team-shop-production.up.railway.app`)

---

## Step 4: Initialize Database

After first deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run python backend/manage.py migrate

# Create superuser (optional, for admin access)
railway run python backend/manage.py createsuperuser
```

---

## Step 5: Test on Your Phone! 📱

1. Open the Railway URL on your phone's browser
2. Test all features:
   - ✅ Create a list
   - ✅ Share the code with another device  
   - ✅ Add/delete items
   - ✅ Enter Shopping Mode
   - ✅ Claim and validate items
   - ✅ Finish shopping
   - ✅ Real-time sync between devices

---

## Alternative: Local Production Test

Test production build locally before deploying:

```bash
# Build everything
./build.sh

# Set environment variables
export DEBUG=False
export SECRET_KEY="test-secret-key"
export ALLOWED_HOSTS="localhost,127.0.0.1"

# Run migrations
cd backend
python manage.py migrate

# Run with Daphne (production server)
daphne -b 0.0.0.0 -p 8000 teamshop.asgi:application
```

Then open `http://localhost:8000` in your browser.

---

## Troubleshooting

### Build Fails
- Check Railway build logs for errors
- Make sure `build.sh` has execute permissions: `chmod +x build.sh`
- Verify all dependencies are in `backend/requirements.txt`

### App Won't Start
- Check `ALLOWED_HOSTS` includes your Railway domain
-Verify `SECRET_KEY` is set
- Check Railway logs for errors

### WebSocket Not Working
- Ensure you're using `https://` URLs (not `http://`)
- WebSocket will use `wss://` automatically with HTTPS
- Check CORS settings include your Railway domain

### Static Files Not Loading
- Run `railway run python backend/manage.py collectstatic`
- Check `STATIC_ROOT` is set correctly in settings.py
- Whitenoise should serve files automatically

### Database Issues
- If using PostgreSQL, make sure it's provisioned in Railway
- Run migrations: `railway run python backend/manage.py migrate`
- Check `DATABASE_URL` environment variable is set

---

## Cost & Limits

**Railway Free Tier:**
- ✅ 500 hours/month runtime (enough for testing!)
- ✅ 1GB RAM
- ✅ Shared CPU  
- ✅ 100GB bandwidth

Perfect for testing and small projects!

---

## Next Steps After Deployment

1. **Custom Domain** (Optional): Railway allows custom domains
2. **Monitoring**: Check Railway metrics for usage
3. **Backups**: Export your database periodically
4. **Scaling**: Upgrade to paid plan if you need more resources

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

---

**You're all set! 🎉**

Your app should be live at: `https://your-app-name.up.railway.app`
