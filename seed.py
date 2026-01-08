import random
import sys
from datetime import datetime
from pymongo import MongoClient
from faker import Faker

# Configuration de la connexion
# Note : on utilise 'mongodb' car c'est le nom du service dans le docker-compose
try:
    client = MongoClient("mongodb://mongodb:27017/", serverSelectionTimeoutMS=5000)
    db = client["mongoflix"]
    # Vérification de la connexion
    client.server_info() 
except Exception as e:
    print(f"Erreur de connexion à MongoDB : {e}")
    sys.exit(1)

fake = Faker()

def seed_data():
    print("--- Début du peuplement de la base mongoflix ---")

    # 1. Nettoyage des collections spécifiques au TP
    # On ne touche pas forcément aux collections existantes (movies, directors) 
    # sauf si tu veux repartir de zéro.
    db.users.delete_many({})
    db.contents.delete_many({})
    db.watch_history.delete_many({})

    # 2. Générer les Utilisateurs (1 000)
    print("Génération de 1 000 utilisateurs...")
    users = []
    for _ in range(1000):
        users.append({
            "email": fake.unique.email(),
            "age": random.randint(13, 80),
            "country": fake.country(),
            "created_at": fake.date_time_between(start_date="-2y", end_date="now")
        })
    user_ids = db.users.insert_many(users).inserted_ids

    # 3. Générer le Catalogue (500 films/séries)
    # Note : On crée une collection 'contents' pour le TP comme demandé
    print("Génération de 500 contenus (films/séries)...")
    genres_list = ["Action", "Sci-Fi", "Drama", "Comedy", "Horror", "Documentary", "Thriller"]
    contents = []
    for _ in range(500):
        contents.append({
            "title": fake.catch_phrase(),
            "type": random.choice(["film", "série"]),
            "genres": random.sample(genres_list, random.randint(1, 3)),
            "duration_minutes": random.randint(20, 180)
        })
    content_ids = db.contents.insert_many(contents).inserted_ids

    # 4. Générer l'Historique de visionnage (50 000)
    print("Génération de 50 000 entrées d'historique...")
    devices = ["tv", "mobile", "tablette", "pc"]
    
    batch_size = 5000
    for i in range(0, 50000, batch_size):
        history_batch = []
        for _ in range(batch_size):
            history_batch.append({
                "user_id": random.choice(user_ids),
                "content_id": random.choice(content_ids),
                "watch_date": fake.date_time_between(start_date="-1y", end_date="now"),
                "watch_time_minutes": random.randint(1, 150),
                "device": random.choice(devices)
            })
        db.watch_history.insert_many(history_batch)
        print(f"Progression : {i + batch_size} / 50000 documents insérés.")

    print("\n--- Fin du Seed ---")
    print(f"Total Users         : {db.users.count_documents({})}")
    print(f"Total Contents      : {db.contents.count_documents({})}")
    print(f"Total Watch History : {db.watch_history.count_documents({})}")

if __name__ == "__main__":
    seed_data()