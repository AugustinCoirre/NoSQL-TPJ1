#!/bin/bash

# Attendre que MongoDB soit prêt
echo "Waiting for MongoDB to be ready..."
sleep 10

# Importer les données
echo "Importing directors..."
mongoimport --host mongodb --db mongoflix --collection directors --file /docker-entrypoint-initdb.d/data/directors.bson

echo "Importing movies..."
mongoimport --host mongodb --db mongoflix --collection movies --file /docker-entrypoint-initdb.d/data/movies.bson

echo "Importing reviews..."
mongoimport --host mongodb --db mongoflix --collection reviews --file /docker-entrypoint-initdb.d/data/reviews.bson

echo "Data import completed!"