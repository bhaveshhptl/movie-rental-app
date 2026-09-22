import * as adminService from "../../service/admin/index.js";

export const viewActiveMovies = async (req, res, next) => {
  try {
    const movies = await adminService.viewActiveMovies();
    return res.status(200).json({ success: true, count: movies.length, movies });
  } catch (error) {
    next(error);
  }
};
