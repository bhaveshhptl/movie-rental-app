import * as adminService from "../../service/admin/index.js";

export const viewAllUsers = async (
  req,
  res,
  next
) => {
  try {
    const users =
      await adminService.viewAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};