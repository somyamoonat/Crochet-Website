# 🚀 The Crochet Diaryy — Production Deployment & Launch Guide

This guide walks through deploying **The Crochet Diaryy** to Supabase and Vercel, running production migrations, configuring Razorpay, and connecting a custom domain.

---

## 1. Production PostgreSQL Database (Supabase Free Tier)

1. Go to [supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **"New Project"**:
   - **Name**: `the-crochet-diaryy`
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Select **South Asia (Mumbai) - ap-south-1** for the lowest latency in India.
3. Once the project is provisioned (~2 minutes), navigate to:
   **Project Settings** &rarr; **Database** &rarr; **Connection string**.
4. Select the **URI** tab:
   - For Prisma with connection pooling (recommended on serverless/Vercel):
     ```env
     DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
     DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
     ```
   - Or standard direct connection:
     ```env
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
     ```

---

## 2. Push Code to GitHub

From your local project terminal in `/Users/somya_moonat/Documents/Crochet Website`:

```bash
# 1. Create a new private or public repository on GitHub (e.g. "crochet-website")
# 2. Link your local repo to GitHub:
git remote add origin https://github.com/<your-username>/crochet-website.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy to Vercel

1. Log in to [vercel.com](https://vercel.com) and click **"Add New..."** &rarr; **"Project"**.
2. Select your `crochet-website` repository from GitHub.
3. In the **Environment Variables** section, add the following variables:

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres...` (From Supabase) | Postgres connection string |
| `AUTH_SECRET` | *Generate via:* `openssl rand -base64 32` | NextAuth v5 session secret |
| `NEXTAUTH_SECRET` | *Same value as AUTH_SECRET* | Legacy NextAuth compatibility |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Base URL of deployed application |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Used for OpenGraph & sitemap URLs |
| `ADMIN_EMAIL` | `admin@thecrochetdiaryy.com` (or Nitika's email) | Admin portal login email |
| `ADMIN_PASSWORD` | Choose a strong password for Nitika | Admin portal password |
| `ADMIN_NOTIFY_EMAIL` | `nitika@...` or `admin@thecrochetdiaryy.com` | Email address receiving alerts on every new order |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Product photo upload |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Product photo upload |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Product photo upload |
| `RAZORPAY_KEY_ID` | `rzp_test_...` (Start with TEST keys first) | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Test Secret | Razorpay Secret Key |
| `RESEND_API_KEY` | `re_...` (From Resend dashboard) | Transactional email delivery |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (or verified domain like `orders@thecrochetdiaryy.com`) | Transactional email sender |

4. Click **Deploy**. Vercel will build and deploy your Next.js 15 application.

---

## 4. Run Production Migrations & Seed Database

Once your Supabase database is online, run the migrations and seed data directly from your local terminal:

```bash
# 1. Run migrations to create tables and enums in Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" npx prisma migrate deploy

# 2. Seed initial categories, admin account, and catalog products
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" npm run db:seed
```

Alternatively, you can skip `npm run db:seed` and log into `/admin` to add Nitika's real products and categories manually with the Cloudinary image uploader.

---

## 5. Live Razorpay Activation & ₹1–10 Verification

> ⚠️ **Important**: Do NOT switch to Live keys until the test mode flow has been confirmed on the live Vercel URL!

1. **Verify Test Mode First**:
   - Complete one checkout on your live Vercel deployment using Razorpay Test credentials (`4111 1111 1111 1111`).
   - Confirm the order is created and status updates to `PAID`.
2. **Switch to Live Keys**:
   - In Razorpay Dashboard &rarr; toggle the top bar switch from **Test Mode** to **Live Mode**.
   - Navigate to **Settings** &rarr; **API Keys** &rarr; **Generate Live Key**.
   - Copy `RAZORPAY_KEY_ID` (`rzp_live_...`) and `RAZORPAY_KEY_SECRET`.
   - Update both keys in your **Vercel Dashboard** &rarr; **Settings** &rarr; **Environment Variables**.
   - Trigger a redeployment in Vercel (*Deployments* &rarr; *Redeploy*).
3. **Conduct Live ₹1–10 Test Transaction**:
   - Add a low-cost item (or temporarily set a product to ₹1–10 in `/admin`).
   - Checkout with your real UPI (Google Pay, PhonePe, or Paytm).
   - Verify payment confirmation in Razorpay dashboard and receipt generation.
   - Refund the test transaction from the Razorpay dashboard.

---

## 6. Custom Domain Setup

1. In Vercel, navigate to: **Project Settings** &rarr; **Domains**.
2. Enter your custom domain (e.g., `thecrochetdiaryy.com` and `www.thecrochetdiaryy.com`).
3. In your domain registrar (GoDaddy, Namecheap, Hostinger, etc.), add the DNS records provided by Vercel:

| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Auto / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Auto / 3600 |

4. Once DNS propagates (typically 5–30 minutes), Vercel automatically provisions a free SSL certificate.
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` in Vercel to use your custom domain (e.g. `https://thecrochetdiaryy.com`).
