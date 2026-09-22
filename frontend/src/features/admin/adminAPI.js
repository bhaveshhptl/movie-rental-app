import api from "../../services/api";

// =====================================================
// USERS
// =====================================================

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");

  return response.data;
};

// =====================================================
// OVERDUE RENTALS
// =====================================================

export const getOverdueRentals = async () => {
  const response = await api.get(
    "/admin/rentals/overdue"
  );

  return response.data;
};

export const getActiveMovies = async () => {
  const response = await api.get("/admin/rentals/active");
  return response.data;
};

// =====================================================
// DAILY TRANSACTIONS
// =====================================================

export const getDailyTransactions = async (
  date
) => {
  const response = await api.get(
    "/admin/transactions/daily",
    {
      params: {
        date,
      },
    }
  );

  return response.data;
};

// =====================================================
// PENALTY
// =====================================================

export const imposePenalty = async (
  rentalId,
  movieId,
  penaltyPerDay
) => {
  const response = await api.post(
    `/admin/rentals/${rentalId}/penalty`,
    {
      movieId,
      penaltyPerDay,
    }
  );

  return response.data;
};

export const createMovie = async (movie) => (await api.post("/movies", movie)).data.movie;
export const updateMovie = async (movieId, movie) => (await api.patch(`/movies/${movieId}`, movie)).data.movie;
export const deleteMovie = async (movieId) => (await api.delete(`/movies/${movieId}`)).data;

// =====================================================
// MAKE ADMIN
// =====================================================

export const makeAdmin = async (userId) => {
  const response = await api.post(
    `/admin/users/${userId}/admin`
  );

  return response.data;
};

// =====================================================
// REMOVE ADMIN
// =====================================================

export const removeAdmin = async (userId) => {
  const response = await api.delete(
    `/admin/users/${userId}/admin`
  );

  return response.data;
};

export const getAllRentals = async () => {
  const response =
    await api.get("/admin/rentals");

  return response.data;
};

export const markRentalReturned =
  async (rentalId) => {
    const response =
      await api.patch(
        `/admin/rentals/${rentalId}/return`
      );

    return response.data;
  };
