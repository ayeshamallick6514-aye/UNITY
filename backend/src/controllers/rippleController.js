const { calculateRipple } = require('../services/rippleEngine');

const simulateRippleDelay = async (req, res) => {
  try {
    const departmentId = req.query.dept || req.body.dept || 'revenue';
    const delayDays = parseInt(req.query.delay || req.body.delay || 10, 10);

    if (isNaN(delayDays) || delayDays <= 0) {
      return res.status(400).json({ error: 'Invalid parameter: delay must be a positive integer.' });
    }

    const result = await calculateRipple(departmentId, delayDays);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  simulateRippleDelay
};
