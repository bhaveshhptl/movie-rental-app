import * as movieService from "../../service/movie/index.js";

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await movieService.getMovieById(id);
    
    await movieService.deleteMovie(id);

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    console.error("Error deleting movie:", error.message);
    return res.status(500).json({ success: false, message: "Unable to delete movie" });
  }
};