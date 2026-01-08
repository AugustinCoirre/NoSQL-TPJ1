# 🎬 Mongoflix - Plateforme de Streaming (Analyse NoSQL)

Ce projet met en place une infrastructure complète pour analyser l'audience d'une plateforme de streaming vidéo en utilisant **MongoDB** et **Docker**.

## Installation et Lancement

1. **Prérequis** : Avoir Docker et Docker Compose installés sur votre machine (Linux Mint).
2. **Lancement de la stack** :

   Dans le terminal, à la racine du projet, exécutez :
   ```bash
   docker compose up --build

   Cette commande va :

    Lancer un conteneur MongoDB 7.0.

    Importer les données BSON initiales (directors, movies, reviews).

    Lancer un service Seeder (Python) qui génère automatiquement les données massives.


## Génération des données 

Le script seed.py s'exécute automatiquement au démarrage via Docker. Il génère les volumes suivants dans la base mongoflix :

    1 000 Utilisateurs (users) : emails uniques, âges entre 13 et 80 ans, pays variés.

    500 Contenus (contents) : mélange de films et séries avec genres multiples.

    50 000 Entrées d'historique (watch_history) : sessions de visionnage réparties sur 1 an avec différents appareils (TV, mobile, etc.).

```bash
docker exec -it mongoflix-db mongosh -u admin -p root--eval "db.getSiblingDB('mongoflix').watch_history.countDocuments()" 
```

## Requêtes d'Analyse 

Toutes les requêtes d'analyse demandées (Top 5 contenus, temps par utilisateur, moyenne d'âge, etc.) sont répertoriées dans le fichier : 👉 queries.md

Vous pouvez les copier et les tester directement dans MongoDB Compass ou via le shell MongoDB du conteneur.
Structure du Projet

    backend/ : API Node.js connectée à MongoDB.

    frontend/ : Interface utilisateur.

    data/ : Dossier contenant les fichiers BSON pour l'initialisation.

    seed.py : Script Python de génération de données massives (50k documents).

    docker-compose.yml : Orchestration des conteneurs.

    queries.md : Bibliothèque des requêtes d'agrégation NoSQL.

## Commandes Utiles

    Arrêter le projet : docker compose down

    Voir les logs du backend : docker logs -f mongoflix-backend

    Accéder à l'API : http://localhost:3000

    Accéder à la Doc API (Swagger) : http://localhost:3000/api-docs

