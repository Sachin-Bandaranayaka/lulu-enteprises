// routes/discountRuleRoutes.js
const express = require('express');
const router = express.Router();
const discountRuleController = require('../controllers/discountRuleController');

router.get('/', discountRuleController.getDiscountRules);

module.exports = router;