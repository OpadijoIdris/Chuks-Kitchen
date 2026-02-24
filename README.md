                    🍽️ Food Ordering Backend API
                        📌 Project Overview

This is a RESTful backend API for a food ordering system built with Node.js, Express, and Sequelize ORM.

The system supports:

User registration with OTP verification

Role-based access control (Admin & User)

Food management (Admin only)

Order creation with multiple items

Payment processing simulation

Order expiration handling

Revenue monitoring (Admin)

The application enforces secure business rules and demonstrates a complete order lifecycle.

                    🛠️ Tech Stack

Node.js

Express.js

Sequelize ORM

SQlite

UUID for primary keys

                    🧱 System Architecture

The system follows a layered architecture:

Controller → Service → Model → Database

Controllers handle HTTP requests and responses

Services contain business logic

Models define database structure

Database stores persistent data

                    🔗 Database Relationships
                User

A User can have many Orders

A User can have many OTP records

                Order

Belongs to a User

Has many OrderItems

Has many Payments

OrderItem

Belongs to an Order

Belongs to a Food item

                Food

Can exist independently

Can be part of many OrderItems

Payment

Belongs to an Order

                🔄 Order Lifecycle

User creates order → pending

Order expires after 15 minutes if unpaid

Payment attempt:

Success → paid

Failure → failed

Expired unpaid orders → cancelled

This ensures transactional integrity and accurate financial tracking.

                    📦 API Endpoints
                👤 User Endpoints

POST /api/users/signup

POST /api/users/verify-otp

POST /api/users/login

                🍛 Food Endpoints

POST /api/foods (Admin)

PUT /api/foods/:id (Admin)

DELETE /api/foods/:id (Admin)

GET /api/foods

GET /api/foods/:id

                🛒 Order Endpoints

POST /api/orders

GET /api/orders (Admin)

GET /api/orders/my-orders

                💳 Payment Endpoints

POST /api/payments/:orderId

                🛡️ Authorization Rules

Only Admin can create/update/delete food

Users can only view their own orders

Only Admin can view all orders

Expired orders cannot be paid

                🚀 How To Run The Project
1️⃣ Clone Repository
git clone 
cd your-project

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create .env file:

PORT=<your port>

4️⃣ Start Server
npm run dev

🧪 Running Tests

Install dev dependencies and run tests:

```bash
npm install
npm run dev
```

Tests run using an in-memory SQLite database (no external DB required).

👨‍💻 Author

Developed as part of internship backend assessment.