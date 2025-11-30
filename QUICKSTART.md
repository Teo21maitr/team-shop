# TeamShop - Quick Deployment Reference Card 🚀

## 🎯 Fastest Path to Deployment (Railway)

### Prerequisites
- ✅ GitHub account (free)
- ✅ Code pushed to GitHub

### 3-Minute Deploy
1. Go to https://railway.app → Sign up with GitHub
2. Click "Deploy from GitHub repo" → Select `team-shop`
3. Add environment variables:
   ```
   DEBUG=False
   SECRET_KEY=<generate-with-command-below>
   ALLOWED_HOSTS=*.railway.app
   ```
4. Wait 2-3 minutes for build
5. Click the URL → Your app is live! 🎉

### Generate Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Initialize Database  
```bash
npm install -g @railway/cli
railway login
railway link
railway run python backend/manage.py migrate
```

---

## 📦 Files Created for You

| File | Purpose |
|------|---------|
| `Procfile` | Tells Railway how to run the app |
| `build.sh` | Builds frontend + collects static files |
| `railway.json` | Railway configuration |
| `.railwayignore` | Excludes dev files from deployment |
| `Dockerfile` | Optional Docker container |
| `DEPLOYMENT.md` | Full deployment guide |

---

## 🔧 Local Production Test

```bash
# Build frontend and collect static files
./build.sh

# Run with production settings
cd backend
DEBUG=False python manage.py migrate
daphne -b 0.0.0.0 -p 8000 teamshop.asgi:application
```

Open `http://localhost:8000`

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Check Railway logs, verify `chmod +x build.sh` |
| App won't start | Set `ALLOWED_HOSTS` and `SECRET_KEY` |
| WebSocket fails | Use HTTPS (automatic on Railway) |
| 404 on static files | Run `railway run python backend/manage.py collectstatic` |

---

## 📊 Free Tier Limits

**Railway Free Plan:**
- 500 hours/month runtime
- 1GB RAM
- 100GB bandwidth
- Perfect for testing!

---

## 📱 Test Checklist

After deployment:
- [ ] Open Railway URL
- [ ] Create a list
- [ ] Add items
- [ ] Test on phone (use Railway URL)
- [ ] Test real-time sync (open 2 tabs)
- [ ] Test Shopping Mode
- [ ] Test "Finish Shopping"

---

## 🆘 Need Help?

**Full Guide:** [DEPLOYMENT.md](file:///Users/teomaitrot/Documents/projet-perso/team-shop/teo21maitr-team-shop/DEPLOYMENT.md)

**Railway Support:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

**You got this! 💪**
