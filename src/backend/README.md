# Projet Quiz & Data Collection

Ce projet contient un quiz interactif et un système de collecte de données (clics, réponses).

## 🛠️ Prérequis

Vous devez avoir **Node.js** installé sur votre ordinateur.
Si ce n'est pas le cas, téléchargez-le ici : [https://nodejs.org/](https://nodejs.org/)

## 🚀 Installation

1.  Ouvrez un terminal (PowerShell ou CMD) dans ce dossier (`d:\sc04`).
2.  Installez les dépendances nécessaires avec la commande suivante :
    ```bash
    npm install
    ```

## ▶️ Démarrage

1.  Lancez le serveur de collecte de données :
    ```bash
    node server.js
    ```
    Vous devriez voir : `Server running on http://localhost:3000`

2.  Ouvrez le fichier `first.html` dans votre navigateur pour commencer l'expérience.

## 📊 Données

Les données sont enregistrées localement dans le fichier `database.sqlite` qui sera créé automatiquement.
-   **Sessions** : Identifiants uniques pour chaque utilisateur.
-   **Events** : Clics sur "Play" et "Passer".
-   **Feedback** : Réponses envoyées via le formulaire.
