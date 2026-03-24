const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const FILE = path.join(__dirname, "scores.json");

// Datei anlegen, falls sie nicht existiert
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

// Ergebnisse speichern
app.post("/save", (req, res) => {
  const entry = req.body;

  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

  data.push({
    ...entry,
    timestamp: Date.now()
  });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json({ status: "ok" });
});

// Ergebnisse abrufen
app.get("/scores", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  res.json(data);
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));

