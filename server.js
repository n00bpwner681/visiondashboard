
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let currentText = "Hello from the website!";
let revision = 0;

app.use(express.json({ limit: "4kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Roblox reads the latest text from this endpoint.
app.get("/api/text", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
        text: currentText,
        revision: revision
    });
});

// Anyone with the website link can update the text.
app.post("/api/text", (req, res) => {
    if (!req.body || typeof req.body.text !== "string") {
        return res.status(400).json({
            error: "Text must be a string."
        });
    }

    if (req.body.text.length > 200) {
        return res.status(400).json({
            error: "Maximum length is 200 characters."
        });
    }

    currentText = req.body.text;
    revision++;

    res.json({
        success: true,
        revision: revision
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
