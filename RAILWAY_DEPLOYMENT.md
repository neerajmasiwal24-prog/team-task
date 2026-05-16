# 🚂 Railway Deployment Guide

I have just prepared your codebase for deployment! I created the `requirements.txt` file and configured `settings.py` so that it uses `dj_database_url` and `whitenoise` to automatically handle databases and static files on Railway.

Here is the step-by-step guide to get your **Team Task Manager** live on the internet.

## Phase 1: Push to GitHub
Railway deploys directly from your GitHub repository. Since we just committed the latest changes to your `main` branch, you need to push them.

1. Create a repository on GitHub (if you haven't already).
2. Open your terminal in your project directory and run:
   ```bash
   git push origin main
   ```

---

## Phase 2: Setup Database on Railway
Railway provides managed databases. We will spin up a PostgreSQL instance.

1. Log into your [Railway Account](https://railway.app/).
2. Click **New Project** → **Provision PostgreSQL**.
3. Railway will instantly create a database for you. 

---

## Phase 3: Deploy the Django Backend
Since your frontend and backend are in the same repository (a monorepo), we will deploy the backend first.

1. In your Railway project, click **New** (or right-click empty space) → **GitHub Repo**.
2. Select your `Team-Task-Manager` repository.
3. Railway will ask what to deploy. Before clicking Deploy, look for the **Settings** gear icon (or let it deploy and immediately click on the service).
4. Go to the service **Settings** tab.
   - Look for **Root Directory**. Type in `/backend` and save it.
   - Look for **Build Command**. Railway should automatically detect Python, but if asked, ensure it installs from `requirements.txt`.
   - Look for **Start Command**. Set it to: `gunicorn core.wsgi`
5. Go to the **Variables** tab for this backend service and add the following:
   - `DATABASE_URL`: *(Click "Add Reference" and select the `DATABASE_URL` from your PostgreSQL plugin)*
   - `SECRET_KEY`: *(Any long random string, e.g., `my-super-secret-production-key`)*
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `*`
6. Go to the **Networking** tab and click **Generate Domain**. Railway will give you a public URL (e.g., `https://backend-production-xyz.up.railway.app`).
   - **Important:** Copy this URL! You will need it for the frontend.
7. To run the migrations, go to the **Deployments** tab, click **View Logs**, and open the **Terminal**. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

---

## Phase 4: Deploy the Next.js Frontend
Now, we deploy the frontend from the exact same GitHub repository, but pointed at a different folder.

1. Back in your Railway project overview, click **New** → **GitHub Repo**.
2. Select your `Team-Task-Manager` repository again! (You will now have two services pointing to the same repo).
3. Click on this new service to open its settings.
4. Go to the **Settings** tab:
   - Under **Root Directory**, type `/frontend` and save.
   - Railway will automatically detect Next.js and build it.
5. Go to the **Variables** tab and add:
   - `NEXT_PUBLIC_API_URL`: Paste the backend URL you generated earlier and append `/api` to it. 
     *(Example: `https://backend-production-xyz.up.railway.app/api`)*
6. Go to the **Networking** tab and click **Generate Domain** to get your public URL for the frontend.

## 🚀 You are live!
Once both services finish building (they will have green checkmarks), click your Frontend domain to view your live web application!
