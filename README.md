# Memory Coffee - Modern Web Experience

A premium, modern web application for **Memory Coffee**, built with Next.js, Tailwind CSS, Framer Motion, and Supabase. This platform provides an immersive user experience with dynamic galleries, a signature menu, table reservations, and a comprehensive admin dashboard.

## Features

- **Immersive UI/UX**: Cinematic, parallax-driven homepage with smooth animations using Framer Motion.
- **Dynamic Menu & Gallery**: Integrated with Supabase to serve up-to-date menu items and stunning gallery photos.
- **Table Reservations**: Seamless booking system with online/offline (local storage) fallback modes.
- **Admin Dashboard (`/admin`)**: A fully featured content management system (CMS) to manage:
  - Menu Items
  - Gallery Photos
  - Section Imagery (Parallax, Sliders, Features)
  - Reservation Approvals
- **Image Optimization**: Client-side browser image compression before uploading to Supabase Storage.
- **Responsive Design**: Tailored for both desktop and mobile viewing with premium "glassmorphism" and modern brutalist aesthetics.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/) (Icons)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth)
- **Forms**: React Hook Form + Zod
- **Carousel**: Embla Carousel React

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (or pnpm/yarn) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

```bash
npm install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: If Supabase is not configured, the application and admin panel will gracefully fall back to a **Demo/Offline Mode** using local browser storage.

### Database Setup (Supabase)

To fully utilize the online capabilities, execute the provided SQL schema in your Supabase SQL Editor:
1. Open the file `supabase/schema.sql`.
2. Copy its contents and run it in your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**.
3. This script will set up all required tables (`menu_items`, `gallery_items`, `section_images`, `reservations`), configure Row Level Security (RLS) policies, insert initial seed data, and create the `coffee-assets` storage bucket.

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

To access the admin panel, navigate to `/admin`.
- **With Supabase configured**: Log in using your Supabase Auth credentials.
- **Demo Mode**: Use the fallback credentials:
  - Email: `admin@fowcoffee.com`
  - Password: `admin123`

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Make sure to add your Supabase environment variables in the Vercel project settings before deploying.
