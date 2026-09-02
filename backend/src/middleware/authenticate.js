import { verifyAccessToken } from "../utils/jwt.js";
import { jsonServerClient } from "../config/jsonServer.js";

export const authenticate = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required"
    });
  }

  const token = authorizationHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = verifyAccessToken(token);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token"
    });
  }

  try {
    const response = await jsonServerClient.get(`/users/${decodedToken.userId}`);
    const user = response.data;

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user"
    };

    return next();
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists"
      });
    }

    return next(error);
  }
};