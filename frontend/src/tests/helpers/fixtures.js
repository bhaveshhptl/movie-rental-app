export const makeUser = (overrides = {}) => ({
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "user",
  createdAt: "2024-01-15T10:00:00.000Z",
  ...overrides,
});

export const makeRental = (overrides = {}) => ({
  id: 101,
  userId: 1,
  rentalDate: "2024-02-01T00:00:00.000Z",
  dueDate: "2024-02-10T00:00:00.000Z",
  returnedDate: null,
  total: 500,
  penalty: 0,
  status: "active",
  ...overrides,
});

export const makeTransaction = (overrides = {}) => ({
  id: 201,
  userId: 1,
  rentalDate: "2024-02-01T00:00:00.000Z",
  totalCost: 750,
  status: "active",
  ...overrides,
});

export const superAdmin = makeUser({
  id: 99,
  name: "Root",
  email: "root@example.com",
  role: "super_admin",
});