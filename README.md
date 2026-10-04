# Restaurant POS & Invoice

A lightweight browser-based restaurant billing application with menu management.

## Features

### Billing / POS
- Menu with categories and food search
- Add items to a cart
- Increase/decrease item quantities
- Automatic subtotal, 5% tax, and total calculation
- Optional customer name
- Sequential invoice numbers stored in browser local storage
- Invoice preview
- Browser print support
- Responsive desktop and mobile layout
- Print-friendly invoice styling

### Menu Management
- Dedicated **Menu Management** screen
- Add new food items
- Edit existing food items
- Delete unwanted food items
- Create new categories while adding an item
- Search and filter menu items
- Menu changes are saved in browser `localStorage`
- Billing screen automatically reads the managed menu

## Run locally

No build tools or backend are required.

1. Clone the repository.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Use **Manage Menu** from the billing screen to maintain the menu.
4. Add/edit/delete items.
5. Return to **Back to Billing**.
6. Select menu items and generate the invoice.

### Browser storage

The current MVP stores menu configuration and invoice numbering in `localStorage`.

This is suitable for a local/demo version. For production use across multiple computers or users, move menu items, invoices and settings to a backend database.

## Product roadmap

### Phase 1 — Billing
- Menu
- Cart
- Invoice
- Printing
- Menu administration

### Phase 2 — Restaurant operations
- Invoice history
- Daily sales report
- Discounts
- GST configuration
- Table/order numbers
- Kitchen order tickets
- Payment methods: Cash / UPI / Card

### Phase 3 — Cloud product
- User authentication
- Restaurant/user roles
- Database persistence
- Multi-device billing
- Cloud invoice history
- Backup and reporting

## Authentication approach

Authentication is intentionally not included in this first MVP. For a production multi-user version, use server-side authentication with short-lived access tokens/session cookies and keep secrets out of browser source code. Never store passwords or long-lived secrets in this static frontend.

## License

Add the project's preferred license before public production use.