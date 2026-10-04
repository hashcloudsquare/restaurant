# Restaurant POS & Invoice

A lightweight browser-based restaurant billing application.

## Features

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

## Run locally

No build tools or backend are required.

1. Clone the repository.
2. Open `index.html` in a browser.
3. Select menu items.
4. Review the cart.
5. Select **Generate Invoice**.
6. Select **Print Invoice**.

For a hosted version, enable GitHub Pages for the repository and use the `main` branch or the published feature branch as appropriate.

## Product roadmap

### Phase 1 — Billing
- Menu
- Cart
- Invoice
- Printing

### Phase 2 — Restaurant operations
- Menu administration
- Invoice history
- Daily sales report
- Discounts
- GST configuration
- Table/order numbers
- Kitchen order tickets

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
