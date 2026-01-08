# 📊 Rapport d'Analyse NoSQL - Mongoflix

Ce document contient les requêtes d'agrégation MongoDB permettant de répondre aux besoins d'analyse de la plateforme de streaming. 

---

## 🛠 Instructions d'exécution
Pour tester ces requêtes, vous pouvez :
1. Utiliser **MongoDB Compass** (onglet Aggregations).
2. Utiliser le terminal via la commande :
   ```bash
   docker exec -it mongoflix-db mongosh -u admin -p password --eval "use mongoflix"

## Top 5 des contenus les plus regardés
db.watch_history.aggregate([
    { $group: { _id: "$content_id", nombre_vues: { $sum: 1 } } },
    { $sort: { nombre_vues: -1 } },
    { $limit: 5 },
    { $lookup: { from: "contents", localField: "_id", foreignField: "_id", as: "detail" } },
    { $unwind: "$detail" },
    { $project: { _id: 0, titre: "$detail.title", type: "$detail.type", nombre_vues: 1 } }
])


## Temps total de visionnage par utilisateur:
db.watch_history.aggregate([
    { $group: { _id: "$user_id", total_minutes: { $sum: "$watch_time_minutes" } } },
    { $sort: { total_minutes: -1 } },
    { $limit: 10 },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user_info" } },
    { $unwind: "$user_info" },
    { $project: { _id: 0, email: "$user_info.email", total_minutes: 1 } }
])

## Moyenne d’âge des spectateurs

db.users.aggregate([
    { $group: { _id: null, age_moyen: { $avg: "$age" } } },
    { $project: { _id: 0, age_moyen: { $round: ["$age_moyen", 1] } } }
])

## Répartition des vues par pays

db.watch_history.aggregate([
    { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $group: { _id: "$user.country", total_vues: { $sum: 1 } } },
    { $sort: { total_vues: -1 } }
])

## Répartition par type d’appareil (Device)

db.watch_history.aggregate([
    { $group: { _id: "$device", total_utilisations: { $sum: 1 } } },
    { $sort: { total_utilisations: -1 } }
])

## Genres les plus regardés (Analyse par durée)

db.watch_history.aggregate([
    { $lookup: { from: "contents", localField: "content_id", foreignField: "_id", as: "content" } },
    { $unwind: "$content" },
    { $unwind: "$content.genres" },
    { $group: { _id: "$content.genres", temps_total_min: { $sum: "$watch_time_minutes" } } },
    { $sort: { temps_total_min: -1 } }
])