import { jsonServerClient } from "../../config/jsonServer.js";

export const imposePenalty = async (rentalId, penaltyPerDay, movieId) => {
  let rental;
  try {
    rental = (await jsonServerClient.get(`/rentals/${rentalId}`)).data;
  } catch (error) {
    const err = new Error(error.response?.status === 404 ? "Rental not found" : "Unable to retrieve rental");
    err.statusCode = error.response?.status || 500;
    throw err;
  }
  if (rental.status === "returned") {
    const error = new Error("Cannot impose a penalty on a returned rental");
    error.statusCode = 409;
    throw error;
  }
  const target = (rental.items || []).find((item) => String(item.movieId) === String(movieId));
  if (!target) {
    const error = new Error("Movie is not part of this rental");
    error.statusCode = 404;
    throw error;
  }
  if (!target.dueDate || new Date(target.dueDate) >= new Date()) {
    const error = new Error("Penalty can only be imposed on an overdue movie");
    error.statusCode = 400;
    throw error;
  }
  const rate = Number(penaltyPerDay);
  if (!Number.isFinite(rate) || rate <= 0) {
    const error = new Error("Penalty per day must be greater than zero");
    error.statusCode = 400;
    throw error;
  }
  const overdueDays = Math.max(1, Math.ceil((Date.now() - new Date(target.dueDate).getTime()) / 86400000));
  const extraDays = Math.max(0, overdueDays - Number(target.penaltyDaysCharged || 0));
  const updatedTarget = { ...target, penaltyPerDay: rate, penaltyDaysCharged: overdueDays, penalty: Number(target.penalty || 0) + extraDays * rate };
  const items = rental.items.map((item) => String(item.movieId) === String(movieId) ? updatedTarget : item);
  const totalCost = items.reduce((total, item) => total + Number(item.lineTotal || 0) + Number(item.penalty || 0), 0);
  try {
    return (await jsonServerClient.patch(`/rentals/${rentalId}`, { items, totalCost, status: "overdue", updatedAt: new Date().toISOString() })).data;
  } catch (error) {
    const err = new Error("Unable to impose penalty");
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};
