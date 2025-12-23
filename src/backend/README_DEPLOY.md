# ☁️ Guide d'Hébergement pour "Quiz & Data Collection"

Comme votre projet utilise un "backend" (le fichier `server.js`) pour enregistrer les données dans une base de données, vous ne pouvez pas utiliser un hébergement statique simple (comme GitHub Pages uniquement). Vous devez héberger le serveur Node.js.

Voici deux options recommandées :

---

## Option 1 : Hébergement Cloud Gratuit/Facile (Render, Railway, Glitch)

C'est la solution la plus simple pour tester.

### Exemple avec **Render.com** (Gratuit) :
1.  Créez un compte sur [Render.com](https://render.com).
2.  Mettez votre code sur **GitHub** ou **GitLab**.
3.  Sur Render, cliquez sur **"New Web Service"**.
4.  Connectez votre dépôt GitHub.
5.  Render détectera automatiquement Node.js.
6.  **Build Command** : `npm install`
7.  **Start Command** : `node server.js`
8.  Cliquez sur "Create Web Service".

⚠️ **Attention avec SQLite et le Cloud Gratuit** :
Sur les plateformes comme Render ou Heroku (version gratuite), le système de fichiers est "éphémère". Cela signifie que si le serveur redémarre (ce qui arrive souvent), votre fichier `database.sqlite` sera réinitialisé et **vous perdrez les données**.
*Solution* : Pour de la production sérieuse, il faudrait utiliser une vraie base de données (PostgreSQL) ou passer à l'Option 2.

---

## Option 2 : Serveur Privé Virtuel (VPS) - Recommandé pour SQLite

C'est la meilleure option pour conserver votre fichier `database.sqlite` intact à moindre coût (environ 3-5€/mois chez OVH, Hetzner, DigitalOcean).

1.  **Louez un VPS** (Ubuntu est recommandé).
2.  **Connectez-vous** en SSH.
3.  **Installez Node.js** sur le serveur.
4.  **Copiez vos fichiers** (via Git ou SFTP).
5.  Lancez le serveur :
    ```bash
    npm install
    # Utiliser PM2 pour garder le site en ligne même si vous fermez la console
    npm install -g pm2
    pm2 start server.js
    ```
6.  Votre site sera accessible via l'adresse IP du serveur : `http://VOTRE_IP:3000`.

---

## 📝 Modification Importante Faite

J'ai déjà modifié le code (`front.js`, `end.html`, `form.html`) pour utiliser des **chemins relatifs** (`/api/track` au lieu de `http://localhost:3000...`).
Cela signifie que le code fonctionnera automatiquement quel que soit l'endroit où vous l'hébergez, sans rien changer !

**Pour tester en local maintenant :**
1.  Lancez `node server.js`
2.  Allez sur `http://localhost:3000/first.html` (Ne pas ouvrir le fichier directement avec un double-clic).
