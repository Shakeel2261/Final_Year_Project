# Stripe Setup Guide - Step by Step

## Step 1: Get Stripe Test Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Login to your Stripe account (or create one if you don't have)
3. Copy these two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

## Step 2: Create .env File in Backend

Create a file named `.env` in the `pos backend` folder with this content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/point_of_sale

# Server Port
PORT=5000

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here_change_this

# Stripe Keys (TEST MODE) - Replace with your actual keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Node Environment
NODE_ENV=development
```

**Important:** Replace `YOUR_SECRET_KEY_HERE` and `YOUR_PUBLISHABLE_KEY_HERE` with your actual Stripe keys.

## Step 3: Create .env.local File in Web Frontend

Create a file named `.env.local` in the `POS Web Frontend` folder:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Stripe Publishable Key (TEST MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

**Important:** Replace `YOUR_PUBLISHABLE_KEY_HERE` with your actual Stripe publishable key.

## Step 4: Verify Setup

After adding keys, restart your servers:

1. **Backend:**
   ```bash
   cd "pos backend"
   npm start
   ```

2. **Web Frontend:**
   ```bash
   cd "POS Web Frontend"
   npm run dev
   ```

## Security Notes

✅ **DO:**
- Keep keys in `.env` files (these are in `.gitignore`)
- Use test keys for development
- Never commit `.env` files to git

❌ **DON'T:**
- Put keys directly in code
- Share keys publicly
- Commit `.env` files to version control

## Testing Stripe

Once keys are added, you can test the payment flow:

1. Go to checkout page
2. Fill in order details
3. Stripe will process test payments
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and any 3-digit CVC

## Need Help?

If you get errors:
- Check that `.env` file exists in correct location
- Verify keys are correct (no extra spaces)
- Make sure server is restarted after adding keys
- Check console for error messages


