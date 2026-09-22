import api from "../../services/api";

export const getMovies = async ({
  accessToken,
  page = 1,
  limit = 8,
  search = "",
  genre = "",
}) => {
  const response = await api.get("/movies", {
    params: {
      page,
      limit,
      search,
      genre,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getMovie = async (movieId) => {
  const response = await api.get(`/movies/${movieId}`);
  return response.data.movie;
};
