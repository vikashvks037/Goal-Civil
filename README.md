# Goal Civil — BPSC Coaching Platform (JavaScript / JSX)

A full-stack Next.js 15 application for BPSC exam coaching, converted from TypeScript to plain JavaScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB via Mongoose
- **Auth**: iron-session (cookie-based sessions)
- **Payments**: Razorpay
- **Storage**: Cloudinary
- **Email**: Nodemailer (Gmail)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/             # Login, Signup, OTP, Forgot Password
│   ├── (public)/           # Landing page, Blog
│   ├── (user)/             # Dashboard (Admin + Student)
│   │   ├── admin/          # Admin panel pages
│   │   └── student/        # Student portal pages
│   └── api/                # API routes
│       ├── auth/           # Auth endpoints
│       ├── admin/          # Admin CRUD endpoints
│       ├── student/        # Student endpoints
│       └── payments/       # Razorpay integration
├── constants/              # Routes & API endpoints
├── features/               # Feature-based components & hooks
│   ├── admin/              # Admin components
│   ├── student/            # Student components
│   ├── course/             # Course enrollment
│   └── payment/            # Payment hooks
├── lib/                    # Utilities (session, mongodb, auth)
├── server/
│   ├── db/models/          # Mongoose models
│   └── lib/                # Mailer, Cloudinary
├── shared/
│   ├── components/         # Reusable UI components
│   ├── layout/             # Header, Footer
│   ├── hooks/              # Custom React hooks
│   └── ui/                 # Base UI components
└── styles/                 # Global CSS
```

## Key Features

- **Public Landing Page** — Hero, features, courses, testimonials, contact
- **Auth System** — Email/OTP verification, forgot password
- **Student Portal** — Browse & enroll in courses, take tests, view results
- **Admin Panel** — Full CRUD for courses, tests, users, payments, analytics
- **Payments** — Razorpay integration with coupon support
- **Test Engine** — MCQ tests with negative marking and leaderboard

## Converting from TypeScript

This project was converted from TypeScript by:
1. Renaming `.ts` → `.js` and `.tsx` → `.jsx`
2. Removing all type annotations, interfaces, and generics
3. Replacing `tsconfig.json` with `jsconfig.json`
4. Removing `typescript` and `@types/*` from devDependencies
