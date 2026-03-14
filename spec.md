# Farm Fresh Fruits Store

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Farmer admin panel to manage fruit listings (add, edit, remove products)
- Product catalog with fruit name, description, price, quantity available, and image
- Customer-facing storefront to browse and order fruits
- Shopping cart for customers
- Order placement with delivery address and contact info
- Farmer order management dashboard (view, update order status: pending, confirmed, out for delivery, delivered)
- Role-based access: farmer (admin) vs customer

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: products CRUD, orders CRUD, role-based access (farmer/customer)
2. Select components: authorization, blob-storage
3. Frontend: storefront page, product detail, cart, checkout form, farmer admin dashboard (products + orders)
