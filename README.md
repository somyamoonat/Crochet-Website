# 🧶 The Crochet Diaryy - E-Commerce Store

Modern e-commerce platform for **The Crochet Diaryy**, built with Next.js 15 App Router, TypeScript, Tailwind CSS, and Prisma ORM.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with Credentials & JWT sessions
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Persistent shopping cart)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Emails**: [Resend](https://resend.com/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── api/auth/         # NextAuth route handlers
│   ├── favicon.ico
│   ├── globals.css       # Tailwind CSS root stylesheet
│   ├── layout.tsx        # Root HTML layout & fonts
│   └── page.tsx          # Store landing page
├── components/           # Reusable React components
│   ├── admin/            # Admin dashboard components
│   ├── cart/             # Shopping cart components
│   ├── product/          # Product displays & cards
│   └── ui/               # Generic UI primitives (Button, etc.)
├── lib/                  # Shared clients, helpers & configurations
│   ├── auth.config.ts    # NextAuth route edge config
│   ├── auth.ts           # NextAuth initialization & providers
│   ├── cloudinary.ts     # Cloudinary SDK client
│   ├── prisma.ts         # Prisma client singleton (db)
│   ├── razorpay.ts       # Razorpay payment gateway client
│   ├── resend.ts         # Resend email client
│   ├── store.ts          # Zustand cart store
│   ├── utils.ts          # Class helper & currency formatting
│   └── validations.ts    # Zod schemas for forms & API requests
├── prisma/
│   ├── schema.prisma     # E-commerce schema (User, Product, Order, etc.)
│   └── seed.ts           # Seed script for initial admin & categories
├── public/               # Static assets & SVG icons
├── types/                # Shared TypeScript definitions
├── .env.example          # Environment variable template
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Configure the environment variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random 32+ character string (`openssl rand -base64 32`)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Default credentials for the admin account
- `CLOUDINARY_*`: Cloudinary cloud name and API credentials
- `RAZORPAY_*`: Razorpay Key ID and Secret
- `RESEND_API_KEY`: Resend API key for transactional emails
- `NEXT_PUBLIC_SITE_URL`: Base application URL (`http://localhost:3000`)

### 3. Generate Prisma Client & Migrate Database

```bash
# Push schema directly to database (development)
npm run db:push

# OR run migrations
npm run db:migrate
```

### 4. Seed the Database

Seed the admin account and starter crochet categories:

```bash
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint check |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push Prisma schema changes directly to DB |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:seed` | Seed database with admin user and categories |
