Backend setup

1. Copy `.env.example` to `.env` in the `backend` folder and fill in `MONGO_URI`.

2. Install dependencies (if not already):

```powershell
npm install
```

3. Start the server (development):

```powershell
npm run dev
```

If you see an error about `MONGO_URI` being missing, ensure the `.env` file exists and the `MONGO_URI` value is set.
