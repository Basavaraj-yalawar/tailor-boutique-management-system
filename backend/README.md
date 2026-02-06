# Tailor Boutique Management System - Backend

A complete RESTful API for managing a boutique/tailor shop with order management, customer tracking, and admin control.

## Features

- **Super Admin Management**: Create and manage admin accounts
- **Admin Authentication**: Secure login and profile management
- **Customer Management**: CRUD operations for customer data
- **Order Management**: Complete order lifecycle with measurements, pricing, and status tracking
- **JWT Authentication**: Secure API endpoints with role-based access control
- **Input Validation**: Zod schemas for request validation
- **PostgreSQL Database**: Robust data persistence with Sequelize ORM

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Input validation
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/tailor_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Create the PostgreSQL database:
```bash
createdb tailor_db
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` and automatically:
- Create all database tables
- Create a default super admin account

### Default Super Admin Credentials

```
Email: superadmin@tailor.com
Username: superadmin
Password: SuperAdmin@123
```

## API Endpoints

### Super Admin Routes (`/api/superadmin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Super admin login | No |
| POST | `/admins` | Create new admin | Yes (Super Admin) |
| GET | `/admins` | Get all admins | Yes (Super Admin) |
| PATCH | `/admins/:id/toggle-status` | Toggle admin active status | Yes (Super Admin) |
| DELETE | `/admins/:id` | Delete admin | Yes (Super Admin) |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Admin login | No |
| GET | `/profile` | Get admin profile | Yes (Admin) |
| PUT | `/profile` | Update admin profile | Yes (Admin) |

### Customer Routes (`/api/customers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new customer | Yes (Any) |
| GET | `/` | Get all customers | Yes (Any) |
| GET | `/:id` | Get customer by ID with orders | Yes (Any) |
| GET | `/search/:phone` | Search customer by phone | Yes (Any) |
| PUT | `/:id` | Update customer | Yes (Any) |
| DELETE | `/:id` | Delete customer | Yes (Any) |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new order | Yes (Any) |
| GET | `/` | Get all orders (supports ?status= filter) | Yes (Any) |
| GET | `/:id` | Get order by ID | Yes (Any) |
| PUT | `/:id` | Update order | Yes (Any) |
| PATCH | `/:id/status` | Update order status | Yes (Any) |
| DELETE | `/:id` | Delete order | Yes (Any) |
| GET | `/customer/:customerId` | Get orders by customer | Yes (Any) |

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Data Models

### SuperAdmin
- id (UUID)
- email (unique)
- username (unique)
- passwordHash
- timestamps

### Admin
- id (UUID)
- email (unique)
- username (unique)
- passwordHash
- phone
- isActive (boolean)
- createdById (FK to SuperAdmin)
- timestamps

### Customer
- id (UUID)
- name
- phone (unique)
- email
- address
- createdById (FK to Admin)
- timestamps

### Order
- id (UUID)
- customerId (FK to Customer)
- orderDate
- deliveryDate
- status (ENUM: 'Open', 'In Progress', 'Delivered')
- garmentType
- fabricDetails
- measurements (JSONB)
- price (decimal)
- advancePaid (decimal)
- balance (decimal, calculated)
- notes
- createdById (FK to Admin)
- timestamps

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

## License

ISC
