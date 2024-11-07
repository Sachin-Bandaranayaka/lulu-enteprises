// sales-agency-backend/routes/discountRuleRoutes.js

const express = require('express');
const router = express.Router();
const discountRuleController = require('../controllers/discountRuleController');

router.get('/', discountRuleController.getDiscountRules);
router.post('/', discountRuleController.createDiscountRule);

module.exports = router;