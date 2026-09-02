import * as movieService from "../../service/movie/index.js";

export const createMovie = async (req, res) => {
  try {
    const { title, genre, releaseYear, description, posterUrl, dailyRate, copies } = req.body;

    const newMovie = {
      title,
      genre,
      releaseYear,
      description: description || "",
      posterUrl: posterUrl || "",
      dailyRate: Number(dailyRate),
      copies: Number(copies)
    };

    const createdMovie = await movieService.createMovie(newMovie);

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie: createdMovie
    });
  } catch (error) {
    console.error("Error creating movie:", error.message);
    return res.status(500).json({ success: false, message: "Unable to create movie" });
  }
};