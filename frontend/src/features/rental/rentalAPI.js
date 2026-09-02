import api from "../../services/api";

export const checkoutCart = async (accessToken) => {
  const response = await api.post(
    "/rentals/checkout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const getRentalHistory = async (
  accessToken
) => {
  const response = await api.get(
    "/rentals/history",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};