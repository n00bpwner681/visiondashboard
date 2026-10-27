const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let fields = {
    Field1: "Field 1",
    Field2: "Field 2",
    Field3: "Field 3",
    Field4: "Field 4",
    Field5: "Field 5"
};

let revision = 0;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fields", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ fields, revision });
});

app.post("/api/fields", (req, res) => {
    const incoming = req.body?.fields;

    if (!incoming || typeof incoming !== "object"
        || Array.isArray(incoming)) {
        return res.status(400).json({ error: "Invalid fields." });
    }

    const updated = {};

    for (let i = 1; i <= 5; i++) {
        const key = `Field${i}`;
        const value = incoming[key];

        if (typeof value !== "string" || value.length > 200) {
            return res.status(400).json({
                error: `${key} must be text up to 200 characters.`
            });
        }

        updated[key] = value;
    }

    fields = updated;
    revision++;

    res.json({ success: true, revision });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Remote text server running on port ${PORT}`);
});
