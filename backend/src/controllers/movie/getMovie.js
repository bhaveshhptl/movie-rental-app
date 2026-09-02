import {
  getAllMoviesService as getMovies,
  getMovieService as getMovieById
} from "../../service/movie/index.js";

export const getAllMovies = async (req, res) => {
  try {
    const {
      search = "",
      genre = "",
      page = 1,
      limit = 10
    } = req.query;

    const result = await getMovies({
      search,
      genre,
      page: Number(page),
      limit: Number(limit)
    });

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error(
      "Error fetching movies:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve movies"
    });
  }
};

export const getMovie = async (req, res) => {
  try {
    const movie = await getMovieById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      movie
    });

  } catch (error) {
    console.error(
      "Error fetching movie:",
      error
    );

    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve movie"
    });
  }
};