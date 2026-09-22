import * as adminService from "../../service/admin/index.js";

export const markRentalReturned = async (
  req,
  res,
  next
) => {
  try {
    const { rentalId } = req.params;

    const rental =
      await adminService.markRentalReturned(
        rentalId
      );

    return res.status(200).json({
      success: true,
      message:
        "Rental marked as returned successfully",
      rental,
    });
  } catch (error) {
    next(error);
  }
};