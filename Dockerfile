# Image de base
FROM python:3.11-slim

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers dans le conteneur
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exposer le port utilisé par Flask
EXPOSE 5000

# Lancer l'application
CMD ["python", "App.py"]
