import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(
  __dirname,
  "data",
  "db.json"
);

const db = JSON.parse(
  fs.readFileSync(dbPath, "utf-8")
);

// =====================================================
// PASSWORDS
// =====================================================

const SUPER_ADMIN_PASSWORD = "Admin@123";

const ADMIN_PASSWORD = "Admin@123";

const USER_PASSWORD = "User@123";

// =====================================================
// HELPERS
// =====================================================

const daysAgo = (days) => {
  const date = new Date();

  date.setDate(
    date.getDate() - days
  );

  return date.toISOString();
};

const daysFromNow = (days) => {
  const date = new Date();

  date.setDate(
    date.getDate() + days
  );

  return date.toISOString();
};

// =====================================================
// USERS
// =====================================================

const users = [
  {
    id: "super-admin-1",
    name: "Bhavesh Patil",
    email: "bhavesh.admin@test.com",
    passwordHash: await bcrypt.hash(
      SUPER_ADMIN_PASSWORD,
      10
    ),
    createdAt: daysAgo(60),
    role: "super_admin"
  },

  {
    id: "admin-1",
    name: "Rahul Kumar",
    email: "rahul.admin@test.com",
    passwordHash: await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    ),
    createdAt: daysAgo(50),
    role: "admin"
  },

  {
    id: "user-1",
    name: "Virat Kohli",
    email: "virat.user@test.com",
    passwordHash: await bcrypt.hash(
      USER_PASSWORD,
      10
    ),
    createdAt: daysAgo(40),
    role: "user"
  },

  {
    id: "user-2",
    name: "Pranav Sharma",
    email: "pranav.user@test.com",
    passwordHash: await bcrypt.hash(
      USER_PASSWORD,
      10
    ),
    createdAt: daysAgo(30),
    role: "user"
  },

  {
    id: "user-3",
    name: "Raghu Verma",
    email: "raghu.user@test.com",
    passwordHash: await bcrypt.hash(
      USER_PASSWORD,
      10
    ),
    createdAt: daysAgo(20),
    role: "user"
  }
];

// =====================================================
// SESSIONS
// =====================================================

const sessions = [];

// =====================================================
// CARTS
// =====================================================

const carts = [
  {
    id: "cart-user-1",
    userId: "user-1",
    items: [
      {
        movieId: "14",
        rentalDays: 2
      },
      {
        movieId: "3",
        rentalDays: 1
      }
    ]
  },

  {
    id: "cart-user-2",
    userId: "user-2",
    items: []
  },

  {
    id: "cart-user-3",
    userId: "user-3",
    items: [
      {
        movieId: "1",
        rentalDays: 3
      }
    ]
  }
];

// =====================================================
// RENTALS
// =====================================================
//
// We deliberately create different rental states:
//
// 1. OVERDUE ACTIVE
// 2. ACTIVE / NOT OVERDUE
// 3. FUTURE-DUE
// 4. RETURNED
// 5. TODAY'S TRANSACTION
//
// =====================================================

const rentals = [

  // ---------------------------------------------------
  // 1. OVERDUE RENTAL
  // ---------------------------------------------------

  {
    id: "rental-overdue-1",

    userId: "user-1",

    items: [
      {
        movieId: "4",
        movieTitle:
          "The Shawshank Redemption",
        rentalDays: 3,
        dailyRate: 35,
        lineTotal: 105,

        dueDate: daysAgo(10)
      }
    ],

    totalCost: 105,

    rentalDate: daysAgo(13),

    status: "active"
  },

  // ---------------------------------------------------
  // 2. ACTIVE RENTAL
  // ---------------------------------------------------

  {
    id: "rental-active-1",

    userId: "user-2",

    items: [
      {
        movieId: "2",
        movieTitle: "Inception",
        rentalDays: 4,
        dailyRate: 45,
        lineTotal: 180,

        dueDate: daysFromNow(3)
      }
    ],

    totalCost: 180,

    rentalDate: daysAgo(1),

    status: "active"
  },

  // ---------------------------------------------------
  // 3. FUTURE DUE RENTAL
  // ---------------------------------------------------

  {
    id: "rental-future-1",

    userId: "user-3",

    items: [
      {
        movieId: "18",
        movieTitle: "Dune",
        rentalDays: 7,
        dailyRate: 55,
        lineTotal: 385,

        dueDate: daysFromNow(7)
      }
    ],

    totalCost: 385,

    rentalDate: daysAgo(1),

    status: "active"
  },

  // ---------------------------------------------------
  // 4. RETURNED RENTAL
  // ---------------------------------------------------

  {
    id: "rental-returned-1",

    userId: "user-2",

    items: [
      {
        movieId: "5",
        movieTitle: "The Godfather",
        rentalDays: 2,
        dailyRate: 35,
        lineTotal: 70,

        dueDate: daysAgo(8)
      }
    ],

    totalCost: 70,

    rentalDate: daysAgo(10),

    status: "returned",

    returnedAt: daysAgo(7)
  },

  // ---------------------------------------------------
  // 5. TODAY'S TRANSACTION
  // ---------------------------------------------------

  {
    id: "rental-today-1",

    userId: "user-1",

    items: [
      {
        movieId: "6",
        movieTitle: "Parasite",
        rentalDays: 2,
        dailyRate: 50,
        lineTotal: 100,

        dueDate: daysFromNow(2)
      }
    ],

    totalCost: 100,

    rentalDate: new Date().toISOString(),

    status: "active"
  },

  // ---------------------------------------------------
  // 6. HISTORICAL TRANSACTION
  // ---------------------------------------------------

  {
    id: "rental-history-1",

    userId: "user-3",

    items: [
      {
        movieId: "10",
        movieTitle: "Jurassic Park",
        rentalDays: 3,
        dailyRate: 35,
        lineTotal: 105,

        dueDate: daysAgo(20)
      }
    ],

    totalCost: 105,

    rentalDate: daysAgo(23),

    status: "returned",

    returnedAt: daysAgo(20)
  }
];

// =====================================================
// UPDATE DB
// =====================================================
//
// IMPORTANT:
// Keep the movies already present in your DB.
// We only replace the data that we intentionally seed.
//

db.users = users;

db.sessions = sessions;

db.carts = carts;

db.rentals = rentals;

// =====================================================
// WRITE DB
// =====================================================

fs.writeFileSync(
  dbPath,
  JSON.stringify(db, null, 2)
);

console.log(
  "============================================"
);

console.log(
  "Database seeded successfully!"
);

console.log(
  "============================================"
);

console.log("");

console.log(
  "SUPER ADMIN"
);

console.log(
  "Email: bhavesh.admin@test.com"
);

console.log(
  "Password: Admin@123"
);

console.log("");

console.log(
  "ADMIN"
);

console.log(
  "Email: rahul.admin@test.com"
);

console.log(
  "Password: Admin@123"
);

console.log("");

console.log(
  "NORMAL USERS"
);

console.log(
  "Virat   → virat.user@test.com / User@123"
);

console.log(
  "Pranav  → pranav.user@test.com / User@123"
);

console.log(
  "Raghu   → raghu.user@test.com / User@123"
);

console.log("");

console.log(
  "Scenarios:"
);

console.log(
  "- 1 overdue active rental"
);

console.log(
  "- 2 active non-overdue rentals"
);

console.log(
  "- 1 returned rental"
);

console.log(
  "- 1 transaction today"
);

console.log(
  "- 1 historical transaction"
);

console.log(
  "- users with empty and non-empty carts"
);

console.log(
  "============================================"
);