import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  return passwordsMatch;
};