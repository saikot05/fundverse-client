# 🌌 FundVerse — Premium Crowdfunding Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel)](https://fundverse-client.vercel.app)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

FundVerse is a modern, high-performance, and secure crowdfunding platform designed for game developers, software creators, and project supporters to collaborate. Built on a cutting-edge stack using Next.js 16 (Turbopack), React 19, and Tailwind CSS v4, the application features modern glassmorphism designs, fluid 3D floating mesh animations, Zod form validations, and custom Better Auth integrations.

🔗 **Live Frontend URL**: [https://fundverse-client.vercel.app](https://fundverse-client.vercel.app)  
🔗 **Live API Gateway URL**: [https://fundverse-server.vercel.app](https://fundverse-server.vercel.app)

---

## 🌟 Key Technical Features

### 1. Advanced 3D & Responsive UI/UX
*   **3D Floating Mesh Gradients**: Drifting, blurred ambient color orbs (`orb-1`, `orb-2`, and `orb-3` using custom brand OKLCH colors) built with CSS `@keyframes` that slide and scale smoothly across page layers.
*   **Translucent Glassmorphism**: Custom layout containers styled with `.glass` classes defining soft-blurred backdrops (`backdrop-filter: blur(14px)`), light borders, and reactive hover animations.
*   **Component Symmetry**: Clean layout alignments with uniform rounding (`rounded-2xl`) and scale hover behaviors.
*   **High-Fidelity Copy**: Fully production-ready copywriting without generic placeholders.

### 2. Multi-Vector Explore & Filtering Hub
*   **Live Debounced Search**: Instant search indexing campaign titles and categories.
*   **Multi-Filter Panel**: Active filters matching category select pills AND target credit ranges via custom slider selectors.
*   **5 Sorting Matrices**: Sort by approaching deadline, target goal (low/high), and pledge progress (low/high).
*   **Pagination Footer**: Responsive pagination controls with Next/Prev page gates.
*   **Campaign Skeletons**: Integrated fallback skeletons (`CampaignSkeleton`) to prevent layout shifts during content fetching.

### 3. Comprehensive Campaign Details
*   Dynamic campaign banner featuring category status indicators.
*   Pledge panels displaying credits progress and funding percentages.
*   Unified backer logs showing contribution history records with relative timestamps.
*   Category-specific campaign recommendation sliders.
*   Built-in audit report forms for reporting fraudulent content.

### 4. Robust Authentication & Social Auto-Linking
*   **Quick Demo Accounts**: One-click autofill credentials for testing as `Demo Supporter` or `Demo Creator`.
*   **Better Auth & Google OAuth**: Complete Social Login integration.
*   **Automatic Account Merging**: Configured `disableImplicitLinking: false` and `requireLocalEmailVerified: false` to allow Google sign-ins to automatically link and merge with existing local email/password records (such as pre-existing seeded users).
*   **Cookie Session Restoration**: Hook updates to always check the active session via `authService.getCurrentUser()` on mount, correctly parsing redirections.

---

## 🛠️ Architecture & Folder Structure

```text
fundverse-client/
├── public/                 # Static assets and media files
├── src/
│   ├── app/                # Next.js App Router folders
│   │   ├── api/auth/       # Better Auth backend handlers
│   │   ├── campaigns/      # Explore and campaign detail pages
│   │   ├── dashboard/      # User role-specific dashboard views
│   │   └── items/          # Campaign creation and management pages
│   ├── components/         # Reusable presentation layout nodes
│   ├── hooks/              # Custom context states (useAuth, useTheme)
│   ├── lib/                # Client configurations (API, Auth client)
│   └── types/              # TypeScript interface definitions
├── .env.local              # Local environment overrides
├── vercel.json             # Vercel routing configurations
└── package.json            # Script registries & dependency configurations
```

---

## ⚙️ Environment Variables Configuration

Create a `.env.local` file in your root folder:

| Variable Name | Description | Value Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | The client base URL for auth redirects | `https://fundverse-client.vercel.app` |
| `BETTER_AUTH_URL` | The server-side base URL for session check | `https://fundverse-client.vercel.app` |
| `BACKEND_API_URL` | The Express backend API host | `https://fundverse-server.vercel.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key for Stripe checkout | `pk_test_...` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | API key for Image Upload service | `19a60...` |
| `MONGODB_URI` | The MongoDB Atlas connection string | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | The target database name | `fundverse` |
| `BETTER_AUTH_SECRET` | Secret key used for hash encryption | `L90z...` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_client_id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |

---

## 📦 Local Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/saikot05/fundverse-client.git
   cd fundverse-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Production Deployment (Vercel)

1. Import the repository into Vercel.
2. Ensure the framework preset is set to **Next.js**.
3. Add the environment variables defined above to your project settings.
4. Deploy the project.
5. In your Google Cloud Console, add this callback redirect URL:
   `https://your-domain.vercel.app/api/auth/callback/google`
