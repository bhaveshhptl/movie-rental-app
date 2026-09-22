import * as adminService from "../../service/admin/index.js";

export const viewOverdueRentals = async (
  req,
  res,
  next
) => {
  try {
    const rentals =
      await adminService.viewOverdueRentals();

    return res.status(200).json({
      success: true,
      count: rentals.length,
      rentals
    });
  } catch (error) {
    next(error);
  }
};