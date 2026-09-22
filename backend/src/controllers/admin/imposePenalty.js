import * as adminService from "../../service/admin/index.js";

export const imposePenalty = async (
  req,
  res,
  next
) => {
  try {
    const { rentalId } = req.params;
    const { penaltyPerDay, movieId } = req.body;

    if (
      penaltyPerDay === undefined ||
      penaltyPerDay === null ||
      Number(penaltyPerDay) <= 0 ||
      !movieId
    ) {
      return res.status(400).json({
        success: false,
        message:
            "A movie ID and valid per-day penalty are required"
      });
    }

    const updatedRental =
      await adminService.imposePenalty(
        rentalId,
        penaltyPerDay,
        movieId
      );

    return res.status(200).json({
      success: true,
      message:
        "Penalty applied successfully",
      rental: updatedRental
    });
  } catch (error) {
    next(error);
  }
};
