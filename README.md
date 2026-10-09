# SchoolERP – School Management System (Demo)

A modern, full-featured School ERP demo built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for easy deployment on **Vercel**.

## Features

- **Role-based access**: Admin, Teacher, Student demo logins
- **Dashboard** with live stats (students, teachers, attendance, pending fees)
- **Student Management** – list, search, add, delete
- **Teacher Management** – cards view, add/remove
- **Classes** – occupancy, class teachers, enrolled students
- **Attendance** – mark present/absent/late/excused by class & date
- **Exams & Grades** – schedule exams, enter marks, auto-grade calculation
- **Fees** – track payments, mark as paid, pending/overdue status
- Fully client-side with in-memory data (resets on refresh) – perfect for demos
- Responsive UI, clean modern design

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Logins

| Role    | Email                        | Access                          |
|---------|------------------------------|---------------------------------|
| Admin   | admin@school.edu             | Full access to all modules      |
| Teacher | sarah.j@school.edu           | Students, Classes, Attendance, Exams |
| Student | alex.k@student.school.edu    | Dashboard, Exams, Fees          |

Just click the role button on the login page – no password required.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Deploy – zero configuration needed

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Client-side state (React Context + localStorage for auth)

## Project Structure

```
src/
├── app/                 # Pages (App Router)
│   ├── login/
│   ├── students/
│   ├── teachers/
│   ├── classes/
│   ├── attendance/
│   ├── exams/
│   ├── fees/
│   ├── layout.tsx
│   └── page.tsx         # Dashboard
├── components/          # UI components
├── context/             # Auth & Data providers
└── lib/                 # Types, mock data, utils
```

## Notes for Production

This is a **demo**. For a real production ERP you would add:

- Database (Postgres / Prisma / Supabase)
- Proper authentication (NextAuth / Clerk)
- Server Actions or API routes for mutations
- File uploads, reports, notifications, etc.

---

Built as a ready-to-deploy Vercel demo.
