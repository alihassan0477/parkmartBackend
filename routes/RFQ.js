const express = require('express');
const router = express.Router();
const RFQController = require('../controller/RFQ');

router.post('/api/create-RFQ', RFQController.createRFQ);

module.exports = router;
