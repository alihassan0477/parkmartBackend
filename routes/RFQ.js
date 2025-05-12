const express = require('express');
const router = express.Router();
const RFQController = require('../controller/RFQ');

router.post('/api/create-RFQ', RFQController.createRFQ);
router.get('/get-rfq-by-seller/:sellerId', RFQController.getRFQsBySellerId);
router.get('/get-total-rfqs/:sellerId', RFQController.getTotalRFQsBySeller);
router.put('/update-rfq-status/:rfqId', RFQController.updateStatus);
router.get(
  '/rfq/status-counts/seller/:sellerId',
  RFQController.getStatusCountsBySeller
);

module.exports = router;
