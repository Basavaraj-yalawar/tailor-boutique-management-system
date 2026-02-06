# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Super Admin Endpoints

### 1. Login Super Admin
**POST** `/superadmin/login`

Login as super admin to get JWT token.

**Request Body:**
```json
{
  "email": "superadmin@tailor.com",
  "password": "SuperAdmin@123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "superadmin@tailor.com",
    "username": "superadmin",
    "role": "superadmin"
  }
}
```

### 2. Create Admin
**POST** `/superadmin/admins`

Create a new admin account (requires super admin token).

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "username": "adminuser",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "adminuser",
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get All Admins
**GET** `/superadmin/admins`

Get list of all admin accounts (requires super admin token).

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Response (200):**
```json
{
  "admins": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "username": "adminuser",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Toggle Admin Status
**PATCH** `/superadmin/admins/:id/toggle-status`

Activate or deactivate an admin account (requires super admin token).

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Response (200):**
```json
{
  "message": "Admin status updated successfully",
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "adminuser",
    "isActive": false
  }
}
```

### 5. Delete Admin
**DELETE** `/superadmin/admins/:id`

Delete an admin account (requires super admin token).

**Headers:**
```
Authorization: Bearer <superadmin_token>
```

**Response (200):**
```json
{
  "message": "Admin deleted successfully"
}
```

---

## Admin Endpoints

### 1. Login Admin
**POST** `/admin/login`

Login as admin to get JWT token.

**Request Body:**
```json
{
  "username": "adminuser",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "adminuser",
    "phone": "+1234567890",
    "role": "admin"
  }
}
```

### 2. Get Admin Profile
**GET** `/admin/profile`

Get current admin's profile (requires admin token).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "adminuser",
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Update Admin Profile
**PUT** `/admin/profile`

Update current admin's profile (requires admin token).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "phone": "+9876543210",
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "admin": {
    "id": "uuid",
    "email": "newemail@example.com",
    "username": "adminuser",
    "phone": "+9876543210"
  }
}
```

---

## Customer Endpoints

All customer endpoints require authentication (admin or super admin token).

### 1. Create Customer
**POST** `/customers`

Create a new customer.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St, City, State"
}
```

**Response (201):**
```json
{
  "message": "Customer created successfully",
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "address": "123 Main St, City, State",
    "createdById": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Customers
**GET** `/customers`

Get list of all customers.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "customers": [
    {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "address": "123 Main St, City, State",
      "createdById": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Customer by ID
**GET** `/customers/:id`

Get customer details with all their orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "address": "123 Main St, City, State",
    "orders": [
      {
        "id": "uuid",
        "orderDate": "2024-01-01T00:00:00.000Z",
        "status": "Open",
        "garmentType": "Suit",
        "price": "500.00",
        "balance": "200.00"
      }
    ]
  }
}
```

### 4. Search Customer by Phone
**GET** `/customers/search/:phone`

Search for a customer by phone number with all their orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "orders": [...]
  }
}
```

### 5. Update Customer
**PUT** `/customers/:id`

Update customer information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "message": "Customer updated successfully",
  "customer": {
    "id": "uuid",
    "name": "John Updated",
    "phone": "+1234567890",
    "email": "johnupdated@example.com",
    "address": "123 Main St, City, State"
  }
}
```

### 6. Delete Customer
**DELETE** `/customers/:id`

Delete a customer (only if they have no orders).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Customer deleted successfully"
}
```

---

## Order Endpoints

All order endpoints require authentication (admin or super admin token).

### 1. Create Order
**POST** `/orders`

Create a new order for a customer.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customerId": "customer-uuid",
  "orderDate": "2024-01-01T00:00:00.000Z",
  "deliveryDate": "2024-01-15T00:00:00.000Z",
  "status": "Open",
  "garmentType": "3-Piece Suit",
  "fabricDetails": "Wool blend, Navy blue",
  "measurements": {
    "chest": 40,
    "waist": 34,
    "hip": 38,
    "shoulder": 18,
    "sleeveLength": 25,
    "shirtLength": 30,
    "pantLength": 42,
    "inseam": 32,
    "thigh": 24
  },
  "price": 500.00,
  "advancePaid": 200.00,
  "notes": "Customer prefers slim fit"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "customerId": "customer-uuid",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "deliveryDate": "2024-01-15T00:00:00.000Z",
    "status": "Open",
    "garmentType": "3-Piece Suit",
    "fabricDetails": "Wool blend, Navy blue",
    "measurements": {
      "chest": 40,
      "waist": 34,
      "hip": 38,
      "shoulder": 18,
      "sleeveLength": 25,
      "shirtLength": 30,
      "pantLength": 42,
      "inseam": 32,
      "thigh": 24
    },
    "price": "500.00",
    "advancePaid": "200.00",
    "balance": "300.00",
    "notes": "Customer prefers slim fit",
    "customer": {
      "id": "customer-uuid",
      "name": "John Doe",
      "phone": "+1234567890"
    }
  }
}
```

### 2. Get All Orders
**GET** `/orders`

Get list of all orders. Supports filtering by status.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by order status (`Open`, `In Progress`, `Delivered`)

**Example:** `/orders?status=Open`

**Response (200):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "customerId": "customer-uuid",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "deliveryDate": "2024-01-15T00:00:00.000Z",
      "status": "Open",
      "garmentType": "3-Piece Suit",
      "price": "500.00",
      "advancePaid": "200.00",
      "balance": "300.00",
      "customer": {
        "id": "customer-uuid",
        "name": "John Doe",
        "phone": "+1234567890"
      }
    }
  ]
}
```

### 3. Get Order by ID
**GET** `/orders/:id`

Get detailed information about a specific order.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "order": {
    "id": "uuid",
    "customerId": "customer-uuid",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "deliveryDate": "2024-01-15T00:00:00.000Z",
    "status": "Open",
    "garmentType": "3-Piece Suit",
    "fabricDetails": "Wool blend, Navy blue",
    "measurements": {
      "chest": 40,
      "waist": 34,
      "hip": 38,
      "shoulder": 18,
      "sleeveLength": 25,
      "shirtLength": 30,
      "pantLength": 42,
      "inseam": 32,
      "thigh": 24
    },
    "price": "500.00",
    "advancePaid": "200.00",
    "balance": "300.00",
    "notes": "Customer prefers slim fit",
    "customer": {
      "id": "customer-uuid",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    }
  }
}
```

### 4. Update Order
**PUT** `/orders/:id`

Update order information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "deliveryDate": "2024-01-20T00:00:00.000Z",
  "status": "In Progress",
  "advancePaid": 350.00,
  "notes": "Updated delivery date as per customer request"
}
```

**Response (200):**
```json
{
  "message": "Order updated successfully",
  "order": {
    "id": "uuid",
    "status": "In Progress",
    "price": "500.00",
    "advancePaid": "350.00",
    "balance": "150.00"
  }
}
```

### 5. Update Order Status
**PATCH** `/orders/:id/status`

Update only the order status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Delivered"
}
```

**Response (200):**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "uuid",
    "status": "Delivered",
    "customer": {
      "name": "John Doe"
    }
  }
}
```

### 6. Delete Order
**DELETE** `/orders/:id`

Delete an order.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

### 7. Get Orders by Customer
**GET** `/orders/customer/:customerId`

Get all orders for a specific customer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "status": "Open",
      "garmentType": "3-Piece Suit",
      "price": "500.00",
      "balance": "300.00",
      "customer": {
        "id": "customer-uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Super admin only."
}
```

### 404 Not Found
```json
{
  "error": "Customer not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## Order Status Values

Orders can have one of three statuses:
- `Open` - Order has been placed but work hasn't started
- `In Progress` - Work on the order is currently underway
- `Delivered` - Order has been completed and delivered to customer

---

## Measurement Fields

The `measurements` object in orders supports the following fields (all optional):
- `chest` - Chest measurement in inches
- `waist` - Waist measurement in inches
- `hip` - Hip measurement in inches
- `shoulder` - Shoulder width in inches
- `sleeveLength` - Sleeve length in inches
- `shirtLength` - Shirt length in inches
- `pantLength` - Pant length in inches
- `inseam` - Inseam measurement in inches
- `thigh` - Thigh measurement in inches

---

## Notes

1. **Balance Calculation**: The `balance` field is automatically calculated as `price - advancePaid` and cannot be set manually.

2. **UUID Format**: All IDs use UUID v4 format.

3. **Date Format**: All dates should be in ISO 8601 format (e.g., `2024-01-01T00:00:00.000Z`).

4. **Phone Numbers**: Should be unique across customers. No specific format enforced but recommended to use international format.

5. **Customer Deletion**: Customers can only be deleted if they have no associated orders.

6. **Admin Status**: Only active admins can log in. Super admins can toggle admin status.
