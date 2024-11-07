// sales-agency-backend/controllers/discountRuleController.js

const { DiscountRule } = require('../models');

exports.getDiscountRules = async (req, res) => {
  try {
    const discountRules = await DiscountRule.findAll({
      order: [['min_amount', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: discountRules
    });
  } catch (error) {
    console.error('Error in getDiscountRules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount rules',
      error: error.message
    });
  }
};

exports.createDiscountRule = async (req, res) => {
  try {
    const { min_amount, percentage } = req.body;

    if (!min_amount || !percentage) {
      return res.status(400).json({
        success: false,
        message: 'min_amount and percentage are required'
      });
    }

    const discountRule = await DiscountRule.create({
      min_amount,
      percentage
    });

    res.status(201).json({
      success: true,
      data: discountRule
    });
  } catch (error) {
    console.error('Error in createDiscountRule:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discount rule',
      error: error.message
    });
  }
};