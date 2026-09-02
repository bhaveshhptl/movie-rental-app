import * as adminService from "../../service/admin/index.js";

export const imposePenalty = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { penaltyAmount } = req.body;

    if (!penaltyAmount || penaltyAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid penalty amount is required"
      });
    }

    const updatedRental = await adminService.imposePenalty(rentalId, penaltyAmount);
    return res.status(200).json({
      success: true,
      message: "Penalty applied successfully",
      rental: updatedRental
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};