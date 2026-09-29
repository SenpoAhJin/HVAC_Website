# Database Setup Instructions

## Importing Schema in cPanel

1. **Login to cPanel**
   - Access your GreenGeeks hosting cPanel

2. **Create Database**
   - Navigate to **MySQL® Databases**
   - Create a new database (e.g., `username_hvac`)
   - Create a database user with a strong password
   - Add the user to the database with ALL PRIVILEGES

3. **Import Schema**
   - Navigate to **phpMyAdmin**
   - Select your database from the left sidebar
   - Click the **Import** tab
   - Click **Choose File** and select `schema.sql`
   - Click **Go** to import

4. **Verify Tables**
   - After import, you should see two tables:
     - `leads` - Stores contact form submissions
     - `rate_limits` - Tracks submission rate limiting
   - Click on each table to verify the structure

## Database Configuration

After creating the database, you'll need to update your configuration file with these values:

- **DB_HOST**: Usually `localhost` on shared hosting
- **DB_NAME**: The database name you created
- **DB_USER**: The database username you created
- **DB_PASSWORD**: The password for the database user

See the main deployment documentation for where to place these values.
