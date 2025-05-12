const express = require('express');
const router = express.Router();
const RFQController = require('../controller/RFQ');

router.post('/api/create-RFQ', RFQController.createRFQ);
router.get('/get-rfq-by-seller/:sellerId', RFQController.getRFQsBySellerId);
router.get('/get-total-rfqs/:sellerId', RFQController.getTotalRFQsBySeller);

module.exports = router;
