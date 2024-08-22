const Plan = require("../../models/Plan");
const User = require("../../models/User");

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json({ plans });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error changing password!" });
  }
};

const purchasePlan = async (req, res) => {
  const { price, title } = req.body;
  const userId = req.userId;
  if (!title || !price)
    return res.status(400).json({ message: "bad request!" });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found!" });

    user.plan = title;
    await user.save();
    res.status(200).json({ message: "plan purchased successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error purchasing plan!" });
  }
};

module.exports = { getPlans, purchasePlan };
