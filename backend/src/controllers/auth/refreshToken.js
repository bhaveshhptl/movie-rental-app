import { refreshUserToken } from "../../service/auth/refreshUserToken.js";

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    const tokens = await refreshUserToken(token);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    next(error);
  }
};