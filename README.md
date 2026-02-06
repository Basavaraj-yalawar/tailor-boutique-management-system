# tailor-boutique-management-system
tailor-boutique-management-system
Step 1: Clone/Pull the Latest Code

If you haven't cloned the repository yet:
bash

git clone https://github.com/Basavaraj-yalawar/tailor-boutique-management-system.git
cd tailor-boutique-management-system

If you already have it cloned, pull the latest changes:
bash

cd tailor-boutique-management-system
git pull origin main

Step 2: Setup Backend

Navigate to backend folder:
bash

cd backend

Install dependencies:
bash

npm install

Setup PostgreSQL Database:
bash

# Install PostgreSQL if not installed
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew):
brew install postgresql@14
brew services start postgresql@14

# Windows: Download from https://www.postgresql.org/download/

Create Database:
bash

# Login to PostgreSQL
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE tailor_management;
CREATE USER tailor_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE tailor_management TO tailor_admin;
\q

Configure Environment Variables:
bash

# Create .env file in backend folder
cp .env.example .env

# Edit .env file with your database credentials
nano .env

Update .env with:
env

PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tailor_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Super Admin (default credentials)
SUPER_ADMIN_EMAIL=superadmin@tailor.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_USERNAME=superadmin

Start Backend Server:
bash

npm run dev

You should see:
Code

✅ Database connection established successfully.
✅ Database models synchronized.
✅ Default Super Admin created
🚀 Server is running on port 5000
📍 API URL: http://localhost:5000/api

Step 3: Setup Frontend

Open a new terminal and navigate to frontend:
bash

cd tailor-boutique-management-system/frontend

Install dependencies:
bash

npm install

Configure Environment Variables:
bash

# Create .env file
cp .env.example .env

# Edit .env
nano .env

Update .env with:
env

VITE_API_URL=http://localhost:5000/api

Start Frontend Dev Server:
bash

npm run dev

You should see:
Code

VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose

Step 4: Access the Application

Open your browser and go to: http://localhost:5173

Login with Default Super Admin:

    Email: superadmin@tailor.com
    Password: SuperAdmin@123

🎯 Quick Start Guide
As Super Admin:

    Login with the default credentials
    Go to "Admin Management" (if available in the navbar)
    Create a new admin user
    Logout

As Admin:

    Login with the admin credentials you created
    Go to "Customers" → "Add Customer"
    Add a customer (name, phone, email, address)
    Go to "Orders" → "Create Order"
    Select the customer, add measurements, set price
    View dashboard to see statistics

🛠️ Troubleshooting
Backend Issues:

Port 5000 already in use:
bash

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001

Database connection failed:
bash

# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
psql -U postgres -c "\l"

Module not found errors:
bash

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

Frontend Issues:

CORS errors:

    Make sure backend is running on port 5000
    Check VITE_API_URL in frontend/.env matches backend URL

Build errors:
bash

# Clear cache and rebuild
rm -rf node_modules .vite package-lock.json
npm install

📦 Optional: Delete the Merged Branch

You can safely delete the branch now:
bash

git branch -d copilot/implement-boutique-management-system

Or click the "Delete branch" button on the GitHub PR page.
🚀 Deployment (Optional)

Once everything works locally, you can deploy:
Backend → Render.com

    Push code to GitHub
    Go to render.com → New Web Service
    Connect your repo
    Set environment variables
    Deploy

Frontend → Vercel

    Go to vercel.com → New Project
    Import your repo
    Set root directory to frontend
    Set VITE_API_URL to your Render backend URL
    Deploy

✅ You're All Set!

Your complete Boutique/Tailor Management System is now ready. You have:

    ✅ Super Admin panel to manage admins
    ✅ Admin panel to manage customers and orders
    ✅ Customer management with phone search
    ✅ Order management with measurements
    ✅ Order status tracking (Open → In Progress → Delivered)
    ✅ Dashboard with statistics
    ✅ Modern, responsive UI
