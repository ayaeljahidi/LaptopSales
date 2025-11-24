# LaptopSales
---

## 🚀 Installation et démarrage

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/ayaeljahidi/LaptopSales.git
```

### 2️⃣ Accéder au dossier Backend

```bash
cd LaptopSales/Backend
```

### 3️⃣ Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration de MongoDB

Avant de lancer le serveur, vous devez **configurer la connexion à votre cluster MongoDB**.

Ouvrez le fichier **app.js** et remplacez :

```js
mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
```

Par votre **URL MongoDB** :

```js
mongoose.connect('YOUR_MONGODB_CLUSTER_URL',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
```

### Comment récupérer votre lien MongoDB ?

1. Aller sur **MongoDB Atlas**
2. Sélectionner votre cluster
3. Cliquer sur **Connect**
4. Choisir **Connect your application**
5. Copier l’URL qui ressemble à :

```
mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

⚠️ **Important :**

* Remplacer `<username>`, `<password>`, et `<dbname>`
---

## ▶️ Lancer le backend

### Mode développement (auto-reload)

```bash
nodemon server.js
```

### Mode production

```bash
node server.js
```

Le serveur démarre par défaut sur :

```
http://localhost:3000
```
---

## 📝 Notes importantes

* Assurez-vous d’avoir installé **Node.js** et **npm**.
* Autorisez votre adresse IP dans MongoDB Atlas (Network Access).
