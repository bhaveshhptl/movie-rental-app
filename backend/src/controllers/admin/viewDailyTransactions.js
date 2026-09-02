import * as adminService from "../../service/admin/index.js";

export const viewDailyTransactions = async (req, res) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().split("T")[0];
    const transactions = await adminService.viewDailyTransactions(targetDate);

    return res.status(200).json({
      success: true,
      date: targetDate,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};