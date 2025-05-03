const express = require('express');
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for shortened URLs
const urlDatabase = {};

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;

    // Validate the URL
    if (!validUrl.isUri(longUrl)) {
        return res.status(401).json('Invalid URL');
    }

    // Generate a unique short URL code
    const shortCode = nanoid(8);
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    // Store the mapping in the database
    urlDatabase[shortCode] = longUrl;

    // Respond with the shortened URL
    res.json({ shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/:code', (req, res) => {
    const { code } = req.params;
    const longUrl = urlDatabase[code];

    if (longUrl) {
        return res.redirect(longUrl);
    } else {
        return res.status(404).json('URL not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
