const calculateROI = (initialInvestment, profit) => {
  if (initialInvestment === 0) return 0; // Avoid division by zero
  return (profit / initialInvestment) * 100;
};

module.exports = { calculateROI };
