"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LedgerService_1 = require("../services/LedgerService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const ledgerService = new LedgerService_1.LedgerService();
router.use(auth_1.requireAuth);
router.post('/', async (req, res) => {
    try {
        console.log('Received buy transaction request body:', req.body);
        const uid = req.user.uid;
        const result = await ledgerService.processBuyTransaction(uid, req.body);
        res.json(result);
    }
    catch (error) {
        console.error('Buy Transaction error:', error);
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});
router.post('/sell', async (req, res) => {
    try {
        console.log('Received sell transaction request body:', req.body);
        const uid = req.user.uid;
        const result = await ledgerService.processSellTransaction(uid, req.body);
        res.json(result);
    }
    catch (error) {
        console.error('Sell Transaction error:', error);
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});
router.delete('/holding/:portfolioId/:assetSymbol', async (req, res) => {
    try {
        console.log('Received delete holding request params:', req.params);
        const uid = req.user.uid;
        const portfolioId = req.params.portfolioId;
        const assetSymbol = req.params.assetSymbol;
        const result = await ledgerService.deleteHolding(uid, portfolioId, assetSymbol);
        res.json(result);
    }
    catch (error) {
        console.error('Delete Holding error:', error);
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map