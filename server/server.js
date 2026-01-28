const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Skill Swap backend running 🚀");
});

// add skill
app.post("/api/skills", (req, res) => {
  const { name, teach, learn, level, contact } = req.body;

  if (!name || !teach || !learn) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    "INSERT INTO skills (name, teach, learn, level, contact) VALUES (?, ?, ?, ?, ?)",
    [name, teach, learn, level, contact],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// get all skills
app.get("/api/skills", (req, res) => {
  db.all("SELECT * FROM skills", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// get matches
app.get("/api/matches/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM skills WHERE id = ?", [id], (err, user) => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    db.all(
      "SELECT * FROM skills WHERE teach = ? AND learn = ?",
      [user.learn, user.teach],
      (err, matches) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(matches);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
