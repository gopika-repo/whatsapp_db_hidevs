# WhatsApp Business Dashboard

A modern, full-featured dashboard for managing WhatsApp Business communications. Built with Next.js 14+, TypeScript, Tailwind CSS, and Shadcn UI.
specifically(Next.js 16.1.1)
## 🚀 Features

- **Dashboard**: Overview of key metrics and recent activity
- **Contacts Management**: Add, edit, and organize your WhatsApp contacts
- **Chat Interface**: Real-time messaging interface with conversation history
- **Campaign Management**: Create and manage marketing campaigns
- **Template Management**: Design and manage message templates
- **Settings**: Configure account and application preferences
- **Authentication**: Secure login system with JWT token management
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive layout for all screen sizes

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (redirects to dashboard)
│   ├── login/               # Login page
│   ├── dashboard/           # Dashboard page
│   ├── contacts/            # Contacts management
│   ├── chats/               # Chat interface
│   ├── campaigns/           # Campaign management
│   ├── templates/           # Template management
│   └── settings/            # Settings page
├── components/
│   ├── layout/              # Layout components (Sidebar, Header, MainLayout)
│   ├── common/              # Reusable components (LoadingSpinner, ErrorBoundary)
│   ├── ui/                  # Shadcn UI components
│   └── [feature]/           # Feature-specific components
├── lib/
│   ├── api-client.ts        # Axios client with JWT interceptors
│   ├── auth.ts              # Authentication utilities
│   ├── constants.ts         # App constants and API endpoints
│   └── utils.ts             # Utility functions
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   ├── useApi.ts            # API request hook
│   └── useToast.ts          # Toast notification hook
├── store/
│   ├── authStore.ts         # Authentication state (Zustand)
│   ├── appStore.ts          # App-wide state (Zustand)
│   └── chatStore.ts         # Chat state (Zustand)
├── types/
│   └── index.ts             # TypeScript type definitions
├── context/
│   └── AuthContext.tsx      # Auth context provider
└── middleware.ts            # Next.js middleware for route protection
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whatsapp-business-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure your environment variables:
```env
NEXT_PUBLIC_APP_NAME=WhatsApp Business Dashboard
NEXT_PUBLIC_API_URL=https://whatsapp-backend-fci4.onrender.com
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Authentication

The application uses JWT-based authentication. To test the login functionality:

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `password123`

> **Note**: These are placeholder credentials. You need to connect to a real backend API for actual authentication.

## 🔌 API Integration

The application is designed to work with a RESTful API backend. Update the `NEXT_PUBLIC_API_URL` in your `.env.local` file to point to your backend server.

### API Endpoints

The following endpoints are expected by the application:

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /contacts` - List contacts
- `GET /chats` - List chats
- `GET /campaigns` - List campaigns
- `GET /templates` - List templates
- `GET /dashboard/stats` - Dashboard statistics

See `lib/constants.ts` for the complete list of API endpoints.

## 🎨 Customization

### Theme Colors

WhatsApp brand colors are defined in `app/globals.css`:

```css
--whatsapp-primary: #128C7E;
--whatsapp-secondary: #25D366;
--whatsapp-light: #DCF8C6;
--whatsapp-dark: #075E54;
--whatsapp-background: #ECE5DD;
```

### Adding New Components

1. Create component in appropriate directory
2. Use TypeScript for type safety
3. Import from Shadcn UI when possible
4. Follow existing naming conventions

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🔒 Protected Routes

All routes except `/login` are protected and require authentication. The middleware (`middleware.ts`) handles automatic redirection to the login page for unauthenticated users.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

Build the application:
```bash
npm run build
```

The built application will be in the `.next` folder. Follow your hosting platform's deployment guide for Next.js applications.

## 📦 State Management

The application uses Zustand for state management:

- **authStore**: User authentication state
- **appStore**: UI state (sidebar, dark mode)
- **chatStore**: Chat and message state

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel](https://vercel.com/) - Deployment platform
- [WhatsApp](https://www.whatsapp.com/) - Brand inspiration

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

Built with ❤️ using Next.js 14+ and TypeScript
