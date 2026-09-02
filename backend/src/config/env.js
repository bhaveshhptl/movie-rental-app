import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ,
  port: Number(process.env.PORT) ,
  clientUrl: process.env.CLIENT_URL ,
  jsonServerUrl: process.env.JSON_SERVER_URL ,
  jwtSecret: process.env.JWT_SECRET ,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
};