const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    res.json({ message: 'TTS handled client-side', text });
});

module.exports = router;
