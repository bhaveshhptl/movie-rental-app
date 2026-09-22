import * as adminService from "../../service/admin/index.js";

export const viewAllRentals = async (
  req,
  res,
  next
) => {
  try {
    const rentals =
      await adminService.viewAllRentals();

    return res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    next(error);
  }
};