# Restaurant POS & Invoice

A lightweight browser-based restaurant billing application with menu management and optional Supabase persistence.

## Features

### Billing / POS
- Menu with categories and food search
- Add items to a cart
- Increase/decrease item quantities
- Automatic subtotal, 5% tax, and total calculation
- Optional customer name
- Sequential invoice numbers
- Invoice preview
- Browser print support
- Responsive desktop and mobile layout
- Print-friendly invoice styling

### Menu Management
- Dedicated **Menu Management** screen
- Add new food items
- Edit existing food items
- Soft-delete unwanted food items
- Create new categories while adding an item
- Search and filter menu items

### Supabase database
- PostgreSQL-backed menu and invoice storage through Supabase
- Supabase schema in `supabase/schema.sql`
- Frontend configuration in `supabase-config.js`
- LocalStorage fallback when Supabase is not configured or temporarily unavailable
- Supabase Realtime synchronization for menu changes across open browser tabs/devices
- Generated invoices stored in `invoices` with line items in `invoice_items`

## Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor** in your Supabase project.
3. Run `supabase/schema.sql`.
4. Open `supabase-config.js`.
5. Set your project URL and **Publishable Key**:

```javascript
window.SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY"
};
```

6. Open `index.html` with VS Code Live Server.
7. Open **Manage Menu** and add/edit/delete an item.
8. Verify the change appears in the Supabase `menu_items` table.
9. Keep the billing page open and verify menu changes are synchronized automatically through Supabase Realtime.

### Security

The current MVP schema contains public/anonymous menu policies because the static application does not have authentication yet. This is intended for development/demo use only.

**Never put a Supabase service-role/secret key in the frontend.** Before production, add authentication and replace the anonymous RLS policies with policies scoped to the signed-in user/restaurant.

## LocalStorage fallback

If `supabase-config.js` contains empty values, the application continues to use browser LocalStorage. This keeps the existing local demo working while the database is being configured.

## Run locally

No build tools are required.

1. Clone the repository.
2. Configure `supabase-config.js` if database mode is required.
3. Open `index.html` using VS Code Live Server.
4. Use **Manage Menu** to maintain menu items.
5. Return to **Back to Billing**.
6. Select items and click **Generate Invoice**. The invoice header and line items are saved to Supabase before the invoice preview opens.
7. Use **Print Invoice** after the invoice has been saved.

## Roadmap

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
