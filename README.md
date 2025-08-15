# BizTrack - Financial Management Dashboard

A modern, production-ready financial tracking application built with React, TypeScript, and Tailwind CSS. Features a beautiful pastel design with comprehensive business management capabilities.

## 🎨 Design & Features

- **Light Pastel Color Palette**: Cream (#FFF9D0), Light Blue (#CAF4FF), Accent Blue (#A0DEFF), Primary Blue (#5AB2FF)
- **Modern UI**: Clean, minimalist design with soft rounded corners and subtle shadows
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Accessibility**: ARIA-compliant with semantic HTML and keyboard navigation support

## 🚀 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system tokens
- **Charts**: Recharts for beautiful data visualizations
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation
- **State Management**: React hooks for local state management

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CurrencySelector.tsx
│   ├── ExpensePie.tsx
│   ├── InventoryCard.tsx
│   ├── KPICard.tsx
│   ├── Navbar.tsx
│   ├── ProfitChart.tsx
│   ├── ReportsGrid.tsx
│   ├── RoleBadge.tsx
│   ├── SettingsPanel.tsx
│   ├── Sidebar.tsx
│   ├── TransactionsTable.tsx
│   └── UploadBillsCard.tsx
├── hooks/               # Custom React hooks
│   ├── useMockData.ts
│   └── useFileUpload.ts
├── lib/                 # Utility functions
│   ├── accessibility.ts
│   ├── currency.ts
│   └── utils.ts
├── pages/               # Page components
│   ├── Bills.tsx
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   ├── Transactions.tsx
│   └── Users.tsx
├── types/               # TypeScript type definitions
│   └── transaction.ts
└── styles/              # Global styles
    └── index.css
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Core Features

### Dashboard
- **KPI Cards**: Total Revenue, Total Expenses, Total Profit with color-coded design
- **Profit Trend Chart**: Interactive line chart showing revenue vs expenses over time
- **Expenses Breakdown**: Pie chart with category-wise expense distribution
- **Recent Transactions**: Table with transaction details and type badges

### Transactions Management
- **Full Transaction Table**: Complete transaction history with filtering and search
- **Advanced Filtering**: Filter by type, account, category, and date range
- **Real-time Search**: Instant search across all transaction fields
- **Export Capabilities**: Ready for CSV/PDF export functionality

### Bills & Receipt Processing
- **Drag & Drop Upload**: Easy file upload with support for PDF, JPG, PNG
- **AI-Powered Parsing**: Mock AI parsing shows vendor, date, amount, and category extraction
- **Bulk Processing**: Handle multiple receipts simultaneously
- **Data Validation**: Automatic data validation and error handling

### Reports & Analytics
- **Financial Reports**: P&L, Cash Flow, Balance Sheet generation
- **Tax Reports**: GST/VAT summary calculations
- **Category Analysis**: Expense and income breakdown by categories
- **Export Options**: Multiple export formats for accountants and stakeholders

### Settings & Administration
- **AI Features**: Toggle AI expense categorization
- **Integrations**: Inventory system linking and synchronization
- **User Roles**: Admin, Accountant, and Employee role management
- **Access Control**: Granular permissions system

### Inventory Integration
- **Real-time Sync**: Connect with external inventory systems
- **COGS Calculation**: Automatic Cost of Goods Sold tracking
- **Stock Monitoring**: Integration status and sync controls
- **Data Consistency**: Ensure financial and inventory data alignment

## 🎯 Design System

The application uses a comprehensive design system built with Tailwind CSS:

### Color Tokens
- `biztrack-cream`: Background color (#FFF9D0)
- `biztrack-light-blue`: Panel backgrounds (#CAF4FF)
- `biztrack-accent-blue`: Accent elements (#A0DEFF)
- `biztrack-primary-blue`: Primary actions (#5AB2FF)

### Component Variants
- **KPI Cards**: Default and accent variants for different metrics
- **Buttons**: Primary, secondary, and outline variants
- **Badges**: Role-based styling for user types and transaction categories
- **Tables**: Consistent styling with hover states and proper contrast

## 🔧 Customization

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add new types in `src/types/`

### Styling Guidelines
- Use design system tokens defined in `tailwind.config.ts`
- Follow the established color palette
- Maintain consistent spacing and typography
- Ensure accessibility standards are met

### Mock Data
The application includes comprehensive mock data for development:
- Transaction records with various types and categories
- Chart data for visualizations
- User management data
- Bill parsing examples

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebar for smaller screens
- Adaptive chart sizing
- Touch-friendly interface elements
- Optimized data tables for mobile viewing

## ♿ Accessibility

- **Semantic HTML**: Proper use of nav, main, header, aside elements
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Visible focus indicators and logical tab order

## 🚀 Deployment

The application is production-ready and can be deployed to:
- Vercel (recommended for Vite projects)
- Netlify
- AWS S3 + CloudFront
- Traditional web servers

Build command: `npm run build`
Output directory: `dist/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and component patterns
4. Add appropriate TypeScript types
5. Test your changes thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**BizTrack** - Making financial management beautiful and accessible.