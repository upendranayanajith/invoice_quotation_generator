# 📄 Invoice and Quotation Generator

A modern, professional invoice and quotation generator built with Next.js, Firebase, and React. Create, manage, and export beautiful invoices and quotations with ease.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

## ✨ Features

- 📝 Create and manage invoices and quotations
- 💾 Save documents to Firebase Firestore
- 📊 Professional PDF generation and export
- 🎨 Clean, modern UI with dark mode support
- 🔍 Search and filter saved documents
- 📱 Responsive design for all devices
- 🏢 Customizable company information and branding
- 🖼️ Support for company logo uploads

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Firebase account** - [Create one here](https://firebase.google.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/upendranayanajith/v0-invoice-and-quotation-generator.git
   cd v0-invoice-and-quotation-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory by copying the example file:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:

   ```env
   # Company Information
   NEXT_PUBLIC_COMPANY_NAME="Your Company Name"
   NEXT_PUBLIC_COMPANY_ADDRESS="Your Company Address"
   NEXT_PUBLIC_COMPANY_EMAIL="your-email@example.com"
   NEXT_PUBLIC_COMPANY_PHONE="+1 234 567 8900"
   NEXT_PUBLIC_COMPANY_REG_NO="REG-12345678"

   # Bank Details
   NEXT_PUBLIC_BANK_NAME="Your Bank Name"
   NEXT_PUBLIC_BANK_ACCOUNT_NAME="Your Account Name"
   NEXT_PUBLIC_BANK_ACCOUNT_NUMBER="1234567890"
   NEXT_PUBLIC_BANK_BRANCH="Your Branch Name"

   # Assets
   NEXT_PUBLIC_COMPANY_LOGO_PATH="/your-logo.png"
   ```

4. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable **Firestore Database**
   - Enable **Firebase Data Connect** (if using)
   - Go to Project Settings > General > Your apps
   - Register a web app and copy the Firebase configuration
   - Create a `lib/firebase.ts` file with your Firebase config:

     ```typescript
     import { initializeApp } from 'firebase/app';
     import { getFirestore } from 'firebase/firestore';

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     ```

5. **Add your company logo** (Optional)

   Place your company logo in the `public` folder and update the `NEXT_PUBLIC_COMPANY_LOGO_PATH` in `.env.local`

6. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

```
v0-invoice-and-quotation-generator/
├── app/                      # Next.js app directory
│   ├── (dashboard)/          # Dashboard pages
│   ├── actions/              # Server actions
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── invoice-preview.tsx   # Invoice preview component
│   └── ui/                   # UI components (shadcn/ui)
├── lib/                      # Utility functions
│   ├── firebase.ts           # Firebase configuration
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
├── dataconnect/              # Firebase Data Connect schemas
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **PDF Generation:** [html2canvas](https://html2canvas.hertzen.com/) + [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Company Information

Update your company details in `.env.local`:
- Company name, address, email, and phone
- Registration number
- Bank details for payment information

### Styling and Theming

The application uses Tailwind CSS with custom theme variables. You can customize the theme in:
- `app/globals.css` - For global styles and CSS variables
- `tailwind.config.js` - For Tailwind configuration

### Firebase Configuration

Make sure to set up Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{document} {
      allow read, write: if request.auth != null;
    }
    match /quotations/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your repository
5. Add your environment variables in the Vercel dashboard
6. Click "Deploy"

### Environment Variables for Vercel

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

## 📝 Usage

1. **Create an Invoice/Quotation**
   - Fill in client details
   - Add line items with descriptions, quantities, and prices
   - Preview in real-time

2. **Save Documents**
   - Click "Save" to store in Firestore
   - Documents are automatically timestamped

3. **Export to PDF**
   - Click "Download PDF" to generate and download

4. **Search and Manage**
   - Browse saved documents
   - Search by client name or invoice number
   - View and edit existing documents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues

If you encounter any issues or have questions, please [open an issue](https://github.com/upendranayanajith/v0-invoice-and-quotation-generator/issues) on GitHub.

## 👨‍💻 Author

**Upendra Nayana Jith**

- GitHub: [@upendranayanajith](https://github.com/upendranayanajith)

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) - AI-powered development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
