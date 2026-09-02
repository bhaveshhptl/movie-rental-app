import jwt from "jsonwebtoken";
import {config} from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

export const generateRefreshToken = (user, sessionId) => {
  return jwt.sign(
    {
      userId: user.id,
      sid: sessionId,
    },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshExpiresIn,
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};