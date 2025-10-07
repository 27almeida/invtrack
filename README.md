# invtrack - 
A system for managing a business's stock.

# Requirements: Node.js, npm, Python 3.9+ e MySQL
# We must create a Virtual environment within the ‘invtrack/backend’ folder
cd invtrack/backend
python -m venv venv 
python3 -m venv venv --depende da versão
venv/Scripts/activate Windows
source venv/bin/activate MacOS
pip install -r requirements.txt (instalar as dependências)
# Inside ‘backend/invtrack/settings.py’ we can configure the connection to the database where it says ‘DATABASES’ on line 61
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser (create a superuser to access the Django admin)
python manage.py runserver (connects the backend and makes the API available)
cd invtrack/frontend
npm install
npm run dev (frontend connected - http://localhost:5173/)
