const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MODEL_NAME = "gemini-3.7-flash";

app.post('/chat', async (req, res) => {
    const { prompt, apiKey } = req.body;
    if (!prompt || !apiKey) {
        return res.status(400).json({ error: "Missing prompt or apiKey" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 80 },
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: 'You are a fast Minecraft AI named Gemini. Keep answers direct and under 20 words.' }]
                }
            })
        });

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply generated.";
        res.json({ reply: text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));

