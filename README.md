# LaptopSales Backend

---

## 🚀 Installation and Startup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ayaeljahidi/LaptopSales.git
```

### 2️⃣ Navigate to the Backend folder

```bash
cd LaptopSales/Backend
```

### 3️⃣ Install dependencies

```bash
npm install
```

---

## ⚙️ MongoDB Configuration

Before starting the server, you need to **configure the connection to your MongoDB cluster**.

Open the **app.js** file and replace:

```js
mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(() => console.log('MongoDB connection failed!'));
```

With your **MongoDB URL**:

```js
mongoose.connect('YOUR_MONGODB_CLUSTER_URL',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(() => console.log('MongoDB connection failed!'));
```

### How to get your MongoDB URL

1. Go to **MongoDB Atlas**
2. Select your cluster
3. Click **Connect**
4. Choose **Connect your application**
5. Copy the URL that looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

⚠️ **Important:**

* Replace `<username>`, `<password>`, and `<dbname>`

---

## ▶️ Start the Backend

### Development mode (auto-reload)

```bash
nodemon server.js
```

### Production mode

```bash
node server.js
```

