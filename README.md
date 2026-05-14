# SkillPath - Modern LMS Platform

SkillPath is a cutting-edge Learning Management System (LMS) built with a **Lavender Brutalist** aesthetic. It features role-based access for Students, Instructors, and Admins, integrated payments with Razorpay, and a robust course management system.

## 🚀 Features

- **Brutalist UI/UX**: High-contrast, bold typography, and a "stroke-first" design system.
- **Role-Based Dashboards**:
  - **Students**: Track progress, enroll in courses, and manage achievements.
  - **Instructors**: Create and manage courses, track student engagement, and monitor earnings.
  - **Admins**: Platform moderation, course approval, user management, and revenue analytics.
- **Course Management**: Complete workflow from creation to approval and enrollment.
- **Secure Authentication**: JWT-based authentication with secure cookie storage.
- **Payment Integration**: Seamless enrollment via Razorpay.
- **Pro/Enterprise Plans**: Automatic free enrollment for premium subscribers.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (Brutalist Design System)
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Payments**: Razorpay SDK

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: A running MongoDB instance (Local or Atlas)
- **Razorpay**: API keys for testing/production

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codewithmesree/skillpath.git
   cd skillpath
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_random_secret_string
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_rzp_key
   RAZORPAY_KEY_SECRET=your_rzp_secret
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing Accounts

- **Admin**: Create a user via `/register` and manually set `role: "admin"` in the database.
- **Instructor**: Choose "Instructor" during registration.
- **Student**: Default account type during registration.

