import * as adminService from "../../service/admin/index.js";

export const viewAllUsers = async (req, res) => {
  try {
    const users = await adminService.viewAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};