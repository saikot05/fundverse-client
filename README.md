# FundVerse — Premium Crowdfunding Platform (Frontend Client)

FundVerse is a modern, high-performance, and secure crowdfunding platform designed for creators, developers, and backers to bring projects to life. Built using Next.js 16, React 19, and Tailwind CSS v4, the application features glassmorphic aesthetics, interactive Recharts analytics, Zod forms validation, and a custom Better Auth integration supporting credentials and Google OAuth.

---

## 🚀 Key Features

*   **Premium Glassmorphism UI**: Beautiful, dark-mode-first interfaces featuring smooth 3D animated mesh gradient backgrounds, interactive scales, and custom hover states.
*   **Flexible Authentication System**: Integrates Better Auth supporting credentials and Google OAuth with automatic account merging and verification bypass.
*   **Dynamic Campaigns Hub**:
    *   **Explore Page**: Real-time debounced title/category search, multi-filter selectors, 5 sorting configurations, and pagination footer controls.
    *   **Interactive Hero Slider**: Configured with play/pause animations and call-to-actions.
    *   **Details Page**: Overview specification grids, contribution timeline histories, related campaign sliders, and user audit report modal forms.
*   **Protected Dashboards**:
    *   **Add Campaign Form**: Form validations using React Hook Form + Zod, deadline calendar pickers, and image loaders.
    *   **Manage Campaigns Table**: A responsive grid to track campaign progress, pledge statistics, and delete actions with confirmation checks.
*   **Analytical Dashboards**: Supports Recharts statistics displaying funding categories, timeline goals, and credit levels.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16.2.10 (Turbopack) using React 19
*   **Language**: TypeScript (Rigid custom typings)
*   **Styling**: Tailwind CSS v4 + HeroUI components
*   **Icons**: Lucide Icons
*   **Charts**: Recharts
*   **State & Forms**: React Hook Form + Zod validation
*   **Authentication**: Better Auth (supporting Google OAuth and session cookies)

---

## 📦 Getting Started

### Prerequisites

*   Node.js 18+ or 20+
*   npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saikot05/fundverse-client.git
   cd fundverse-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   # Public keys
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

   # Backend API Proxy URL
   BACKEND_API_URL=http://localhost:5000

   # Database & Secrets
   MONGODB_URI=your_mongodb_atlas_connection_string
   MONGODB_DB_NAME=fundverse
   BETTER_AUTH_SECRET=your_better_auth_secret_hash

   # Google Social Credentials
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment Guidelines (Vercel)

To deploy the frontend to Vercel:

1. Import the repository into your Vercel Dashboard.
2. Select the **Next.js** framework preset.
3. Configure the environment variables defined in your `.env.local` file.
   * *Note: Ensure `NEXT_PUBLIC_BETTER_AUTH_URL` and `BETTER_AUTH_URL` match your Vercel domain (e.g. `https://your-app.vercel.app`), and `BACKEND_API_URL` points to your deployed server URL.*
4. Deploy the project.
5. In your Google Cloud Console, update the Authorized Redirect URI to:
   `https://your-app.vercel.app/api/auth/callback/google`
