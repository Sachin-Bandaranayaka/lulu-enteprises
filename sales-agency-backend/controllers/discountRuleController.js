// controllers/discountRuleController.js
const { DiscountRule } = require('../models');

exports.getDiscountRules = async (req, res) => {
  try {
    const discountRules = await DiscountRule.findAll();
    res.json(discountRules);
  } catch (error) {
    res.status(500).send(error.message);
  }
};