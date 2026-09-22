import * as movieService from "../../service/movie/index.js";

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await movieService.getMovieById(id);

    const updatedMovie = await movieService.updateMovie(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie: updatedMovie
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error("Error updating movie:", error.message);
    return res.status(500).json({ success: false, message: "Unable to update movie" });
  }
};
