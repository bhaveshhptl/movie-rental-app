import { logoutUser } from "../../service/auth/logoutUser.js";

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    await logoutUser(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};