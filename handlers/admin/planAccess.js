const Plan = require("../../models/Docu");
const User = require("../../models/User");

const createPlan = async (req, res) => {
  const { title, info, features, price } = req.body;
  if (!title || !info || !features || !price)
    return res.status(400).json({ message: "bad request!" });
  try {
    const newPlan = {
      title: title,
      info: info,
      price: price,
      features: features,
    };

    await Plan.create(newPlan);
    res.status(200).json({ message: "plan created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating plan!" });
  }
};

module.exports = { createPlan };
