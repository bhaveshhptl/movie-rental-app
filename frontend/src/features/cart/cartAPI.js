import api from "../../services/api";

export const getCart = async (accessToken) => {
  const response = await api.get("/cart", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const addToCart = async (
  accessToken,
  movieId,
  rentalDays
) => {
  const response = await api.post(
    "/cart",
    {
      movieId,
      rentalDays,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const updateCartItem = async (
  accessToken,
  movieId,
  rentalDays
) => {
  const response = await api.patch(
    `/cart/${movieId}`,
    {
      rentalDays,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const removeFromCart = async (
  accessToken,
  movieId
) => {
  const response = await api.delete(
    `/cart/${movieId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const clearCart = async (accessToken) => {
  const response = await api.delete("/cart", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};