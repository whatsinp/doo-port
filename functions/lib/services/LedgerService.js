"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerService = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const decimal_js_1 = __importDefault(require("decimal.js"));
decimal_js_1.default.set({ rounding: decimal_js_1.default.ROUND_HALF_UP });
class LedgerService {
    get db() {
        return admin.firestore();
    }
    async processBuyTransaction(userId, data) {
        // 1. Extract payload
        const { portfolioId, assetSymbol, quantity, unitPrice, tradeCurrency } = data;
        if (!portfolioId || !assetSymbol || !quantity || !unitPrice) {
            throw new Error('Missing required fields');
        }
        const buyQty = new decimal_js_1.default(quantity);
        const price = new decimal_js_1.default(unitPrice);
        if (buyQty.lte(0) || price.lte(0))
            throw new Error('Quantity and price must be greater than zero');
        const grossAmount = buyQty.times(price);
        const txId = this.db.collection('transactions').doc().id;
        const holdingId = `${portfolioId}_${assetSymbol}`;
        const holdingRef = this.db.collection('holdings').doc(holdingId);
        const txRef = this.db.collection('transactions').doc(txId);
        // 2. Perform atomic transaction
        await this.db.runTransaction(async (t) => {
            const holdingDoc = await t.get(holdingRef);
            let prevQty = new decimal_js_1.default(0);
            let prevCostBasis = new decimal_js_1.default(0);
            if (holdingDoc.exists) {
                const hData = holdingDoc.data();
                if (hData.userId !== userId)
                    throw new Error('Unauthorized');
                prevQty = new decimal_js_1.default(hData.quantity);
                prevCostBasis = new decimal_js_1.default(hData.costBasis);
            }
            // 3. Calculate new holding per CALCULATION_SPEC.md
            const newQuantity = prevQty.plus(buyQty);
            const newCostBasis = prevCostBasis.plus(grossAmount);
            const newAverageCost = newQuantity.isZero()
                ? new decimal_js_1.default(0)
                : newCostBasis.dividedBy(newQuantity);
            // 4. Save Transaction
            t.set(txRef, {
                id: txId,
                userId,
                portfolioId,
                type: 'BUY',
                assetSymbol,
                quantity: buyQty.toFixed(6),
                unitPrice: price.toFixed(6),
                fees: '0',
                taxes: '0',
                grossAmount: grossAmount.toFixed(6),
                tradeCurrency: tradeCurrency || 'USD',
                transactionDate: new Date().toISOString(),
                createdAt: firestore_1.FieldValue.serverTimestamp()
            });
            // 5. Save Holding
            t.set(holdingRef, {
                id: holdingId,
                userId,
                portfolioId,
                assetSymbol,
                tradeCurrency: tradeCurrency || 'USD',
                quantity: newQuantity.toFixed(6),
                costBasis: newCostBasis.toFixed(6),
                averageCost: newAverageCost.toFixed(6),
                updatedAt: firestore_1.FieldValue.serverTimestamp()
            }, { merge: true });
        });
        return { success: true, message: 'Buy transaction processed securely', data: { id: txId } };
    }
    async processSellTransaction(userId, data) {
        const { portfolioId, assetSymbol, quantity, unitPrice, tradeCurrency } = data;
        if (!portfolioId || !assetSymbol || !quantity || !unitPrice) {
            throw new Error('Missing required fields');
        }
        const sellQty = new decimal_js_1.default(quantity);
        const price = new decimal_js_1.default(unitPrice);
        if (sellQty.lte(0) || price.lte(0))
            throw new Error('Quantity and price must be greater than zero');
        const grossAmount = sellQty.times(price);
        const txId = this.db.collection('transactions').doc().id;
        const holdingId = `${portfolioId}_${assetSymbol}`;
        const holdingRef = this.db.collection('holdings').doc(holdingId);
        const txRef = this.db.collection('transactions').doc(txId);
        await this.db.runTransaction(async (t) => {
            const holdingDoc = await t.get(holdingRef);
            if (!holdingDoc.exists) {
                throw new Error('Holding not found. Cannot sell asset you do not own.');
            }
            const hData = holdingDoc.data();
            if (hData.userId !== userId)
                throw new Error('Unauthorized');
            const prevQty = new decimal_js_1.default(hData.quantity);
            const prevCostBasis = new decimal_js_1.default(hData.costBasis);
            const prevAverageCost = new decimal_js_1.default(hData.averageCost);
            if (sellQty.gt(prevQty)) {
                throw new Error('Cannot sell more than the currently owned quantity.');
            }
            // 3. Calculate new holding per CALCULATION_SPEC.md
            const costOfSoldQuantity = prevAverageCost.times(sellQty);
            const realizedProfit = grossAmount.minus(costOfSoldQuantity); // netSellProceeds - costOfSoldQuantity (assuming fees=0)
            const newQuantity = prevQty.minus(sellQty);
            const newCostBasis = prevCostBasis.minus(costOfSoldQuantity);
            const newAverageCost = newQuantity.isZero() ? new decimal_js_1.default(0) : prevAverageCost; // Average cost per share does not change on sell
            // 4. Save Transaction
            t.set(txRef, {
                id: txId,
                userId,
                portfolioId,
                type: 'SELL',
                assetSymbol,
                quantity: sellQty.toFixed(6),
                unitPrice: price.toFixed(6),
                fees: '0',
                taxes: '0',
                grossAmount: grossAmount.toFixed(6),
                realizedProfit: realizedProfit.toFixed(6),
                tradeCurrency: tradeCurrency || 'USD',
                transactionDate: new Date().toISOString(),
                createdAt: firestore_1.FieldValue.serverTimestamp()
            });
            // 5. Update Holding
            t.set(holdingRef, {
                id: holdingId,
                userId,
                portfolioId,
                assetSymbol,
                tradeCurrency: tradeCurrency || 'USD',
                quantity: newQuantity.toFixed(6),
                costBasis: newCostBasis.toFixed(6),
                averageCost: newAverageCost.toFixed(6),
                updatedAt: firestore_1.FieldValue.serverTimestamp()
            }, { merge: true });
        });
        return { success: true, message: 'Sell transaction processed securely', data: { id: txId } };
    }
    async deleteHolding(userId, portfolioId, assetSymbol) {
        if (!portfolioId || !assetSymbol) {
            throw new Error('Missing required fields');
        }
        const holdingId = `${portfolioId}_${assetSymbol}`;
        const holdingRef = this.db.collection('holdings').doc(holdingId);
        await this.db.runTransaction(async (t) => {
            const holdingDoc = await t.get(holdingRef);
            if (!holdingDoc.exists) {
                throw new Error('Holding not found.');
            }
            const hData = holdingDoc.data();
            if (hData.userId !== userId)
                throw new Error('Unauthorized');
            // 1. Delete Holding
            t.delete(holdingRef);
            // Note: In a complete production app, we would also query and delete 
            // all transactions related to this holding, but Firestore transactions 
            // don't support unbounded queries easily. We will delete the transactions outside the atomic block
            // or just leave them. The user asked for "แบบลบไปเลย", so we will query and delete them in a batch.
        });
        // Batch delete transactions
        const txQuery = this.db.collection('transactions')
            .where('userId', '==', userId)
            .where('portfolioId', '==', portfolioId)
            .where('assetSymbol', '==', assetSymbol);
        const txDocs = await txQuery.get();
        if (!txDocs.empty) {
            const batch = this.db.batch();
            txDocs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
        return { success: true, message: 'Holding completely deleted' };
    }
}
exports.LedgerService = LedgerService;
//# sourceMappingURL=LedgerService.js.map