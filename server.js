const express = require("express");
const fetch = require("node-fetch");
const readline = require("readline");

const app = express();
const PORT = process.env.PORT || 3000;

// TEST route
app.get("/", (req, res) => {
  res.send("API WORKING ✅");
});

// 🔴 YOUR DROPBOX LINK
const DATA_URL = "https://www.dropbox.com/scl/fi/ahobdk534mhda2zqwgki1/Indian-1M-Sample.csv?rlkey=2mq94badx4xurqgcl2ql0gj20&st=u3u6d9ut&dl=1";

// SEARCH route
app.get("/data", async (req, res) => {
  const query = req.query.search;

  if (!query) {
    return res.json({ error: "search query required" });
  }

  try {
    const response = await fetch(DATA_URL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const rl = readline.createInterface({
      input: response.body,
      crlfDelay: Infinity
    });

    let results = [];
    let count = 0;

    for await (const line of rl) {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        results.push(line);
        count++;
        if (count >= 50) break;
      }
    }

    res.json({ count, data: results });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
