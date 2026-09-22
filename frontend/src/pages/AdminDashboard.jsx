import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import AdminStatsCards from "../components/admin/AdminStatsCards";
import AdminUsersTable from "../components/admin/AdminUsersTable";
import AdminRentalsTable from "../components/admin/AdminRentalsTable";
import AdminOverdueRentals from "../components/admin/AdminOverdueRentals";
import AdminDailyTransactions from "../components/admin/AdminDailyTransactions";
import AdminActiveMovies from "../components/admin/AdminActiveMovies";
import RentalDetailsModal from "../components/admin/RentalDetailsModal";
import UserRentalHistoryModal from "../components/admin/UserRentalHistoryModal";
import { getToday } from "../components/admin/helpers";

import {
  fetchAdminUsers,
  fetchOverdueRentals,
  fetchActiveMovies,
  fetchDailyTransactions,
  applyPenalty,
  promoteUser,
  demoteAdmin,
  clearAdminActionError,
  clearAdminError,
  fetchAllRentals,
  returnRental,
} from "../features/admin/adminSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const {
    users,
    overdueRentals,
    transactions,
    rentals,
    activeMovies,
    rentalsLoading,
    usersLoading,
    overdueLoading,
    transactionsLoading,
    actionLoading,
    error,
    actionError,
  } = useSelector((state) => state.admin);

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [penaltyAmounts, setPenaltyAmounts] = useState({});
  const [selectedRental, setSelectedRental] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // ---- Initial load ----
  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchOverdueRentals());
    dispatch(fetchActiveMovies());
    dispatch(fetchDailyTransactions(getToday()));
    dispatch(fetchAllRentals());
  }, [dispatch]);

  // ---- Handlers ----
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    dispatch(fetchDailyTransactions(date));
  };

  const handlePenaltyChange = (rentalId, value) => {
    setPenaltyAmounts((prev) => ({ ...prev, [rentalId]: value }));
  };

  const handlePenalty = async (movie) => {
    const key = `${movie.rentalId}-${movie.movieId}`;
    const amount = Number(penaltyAmounts[key]);
    if (!amount || amount <= 0) return;

    const result = await dispatch(
      applyPenalty({ rentalId: movie.rentalId, movieId: movie.movieId, penaltyPerDay: amount })
    );

    if (applyPenalty.fulfilled.match(result)) {
      setPenaltyAmounts((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handlePromote = async (userId) => {
    if (!window.confirm("Are you sure you want to make this user an admin?")) return;
    await dispatch(promoteUser(userId));
  };

  const handleDemote = async (userId) => {
    if (!window.confirm("Are you sure you want to remove admin privileges from this user?")) return;
    await dispatch(demoteAdmin(userId));
  };

  const handleReturnRental = async (rentalId) => {
    if (!window.confirm("Are you sure you want to mark this rental as returned?")) return;
    try {
      await dispatch(returnRental(rentalId)).unwrap();
    } catch (err) {
      console.error("Failed to return rental:", err);
    }
  };

  // ---- Derived stats ----
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <AppNavbar />

      <Container fluid className="py-4 px-4 px-lg-5">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center"><h1 className="fw-bold mb-1">Admin Dashboard</h1>{currentUser?.role === "admin" && <Button variant="outline-light" onClick={() => navigate("/admin/movies")}>Manage Movies</Button>}</div>
          <p className="text-secondary mb-0">
            Manage users, rentals and daily transactions.
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => dispatch(clearAdminError())}>
            {error}
          </Alert>
        )}
        {actionError && (
          <Alert variant="danger" dismissible onClose={() => dispatch(clearAdminActionError())}>
            {actionError}
          </Alert>
        )}

        <AdminStatsCards
          users={users}
          adminCount={adminCount}
          overdueRentals={overdueRentals}
          transactions={transactions}
        />

        <AdminUsersTable
          users={users}
          usersLoading={usersLoading}
          currentUser={currentUser}
          actionLoading={actionLoading}
          onPromote={handlePromote}
          onDemote={handleDemote}
          onViewHistory={(user) => { setSelectedUser(user); setSelectedRental(null); }}
        />

        <AdminRentalsTable
          rentals={rentals}
          users={users}
          rentalsLoading={rentalsLoading}
          actionLoading={actionLoading}
          onReturn={handleReturnRental}
          onViewRental={(rental) => { setSelectedRental(rental); setSelectedUser(users.find((user) => String(user.id) === String(rental.userId))); }}
        />

        <AdminActiveMovies movies={activeMovies} loading={overdueLoading} />

        <AdminOverdueRentals
          overdueRentals={overdueRentals}
          overdueLoading={overdueLoading}
          actionLoading={actionLoading}
          penaltyAmounts={penaltyAmounts}
          onPenaltyChange={handlePenaltyChange}
          onApplyPenalty={handlePenalty}
          onReturn={handleReturnRental}
        />

        <AdminDailyTransactions
          transactions={transactions}
          transactionsLoading={transactionsLoading}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </Container>
      {selectedUser && !selectedRental && <UserRentalHistoryModal user={selectedUser} rentals={rentals} onHide={() => setSelectedUser(null)} onSelectRental={(rental) => setSelectedRental(rental)} />}
      {selectedRental && <RentalDetailsModal rental={selectedRental} user={selectedUser} onHide={() => { setSelectedRental(null); setSelectedUser(null); }} />}
    </>
  );
}

export default AdminDashboard;
