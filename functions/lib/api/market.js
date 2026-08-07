"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MockMarketProvider_1 = require("../providers/MockMarketProvider");
const router = (0, express_1.Router)();
const provider = new MockMarketProvider_1.MockMarketProvider();
router.get('/search', async (req, res) => {
    const query = req.query.query || req.query.q || '';
    const results = await provider.searchAssets(query);
    res.json({ success: true, message: 'Search results', data: results });
});
router.get('/quotes/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const quote = await provider.getQuote(symbol);
    res.json({ success: true, message: 'Quote retrieved', data: quote });
});
router.get('/historical/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const timeframe = req.query.timeframe || '1M';
    const data = await provider.getHistoricalData(symbol, timeframe);
    res.json({ success: true, message: 'Historical data retrieved', data });
});
exports.default = router;
//# sourceMappingURL=market.js.map