const express = require("express");
const router = express.Router();
const { analyzeJavaScript } = require("../services/eslintAnalyzer");

router.post("/static", async (req, res) => {
  const { code, language } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    let findings = [];

    if (language === "javascript") {
      findings = await analyzeJavaScript(code);
    } else {
      return res.status(400).json({
        error: `Static analysis for "${language}" isn't set up yet. Only JavaScript is supported right now.`,
      });
    }

    res.status(200).json({ findings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;