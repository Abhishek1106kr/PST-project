const express = require('express');
const router = express.Router();

// Create link token
router.get('/api/create-link-token', async (req, res) => {
    try {
        const linkToken = await createLinkToken();
        res.json(linkToken);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exchange public token
router.post('/api/exchange-token', async (req, res) => {
    try {
        const { public_token } = req.body;
        const exchangeResponse = await exchangePublicToken(public_token);
        res.json(exchangeResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get loans
router.post('/api/get-loans', async (req, res) => {
    try {
        const { access_token } = req.body;
        const loans = await getLoanData(access_token);
        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});