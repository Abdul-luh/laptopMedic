// Installation and Setup Instructions (README.md)

# Laptop Medic - AI-Powered Laptop Diagnostics

A comprehensive web application built with Next.js, TypeScript, Material UI, and Tailwind CSS that provides AI-powered laptop diagnostics and solutions.

## Features

- 🤖 AI-powered laptop problem diagnosis
- 🔧 Step-by-step repair solutions
- 📱 Responsive design with Material UI and Tailwind CSS
- 📊 Diagnosis history tracking
- 👨‍💻 Contact technician functionality
- ✅ Form validation with Zod
- 💾 Local storage for user data

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Material UI
- **Validation:** Zod
- **Icons:** Material UI Icons
- **State Management:** React hooks + Local Storage

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Create a new Next.js project:

```bash
npx create-next-app@latest laptop-medic --typescript --tailwind --eslint --app
cd laptop-medic
```

2. Install dependencies:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zod
```

3. Copy the provided code files into your project structure:

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── theme.ts
├── diagnose/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── history/
│   └── page.tsx
└── login/
    └── page.tsx

components/
├── Header.tsx
├── DiagnosisForm.tsx
└── DiagnosisResult.tsx

lib/
├── validations.ts
└── ai-diagnosis.ts

types/
└── index.ts
```

4. Update your `tailwind.config.js` and `next.config.js` as provided

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Running Diagnostics

1. Navigate to the "Diagnose" page
2. Select your laptop brand and issue category
3. Choose relevant symptoms
4. Set urgency level and provide detailed description
5. Click "Run Diagnosis" to get AI-powered solutions

### Viewing History

- Access your previous diagnoses in the "History" section
- View detailed solutions and recommendations
- Clear history when needed

### Contacting Support

- Use the contact form to reach technical support
- Upload files for better assistance
- Track your support requests

## Key Components

### DiagnosisForm

Handles user input with comprehensive validation using Zod schemas.

### DiagnosisResult

Displays AI-generated solutions with visual indicators for difficulty and urgency.

### AI Diagnosis Engine

Rule-based system that analyzes symptoms and provides targeted solutions.

## Customization

### Adding New Issue Categories

Update the `knowledgeBase` object in `lib/ai-diagnosis.ts`:

```typescript
const knowledgeBase = {
  newIssue: {
    causes: ["Cause 1", "Cause 2"],
    solutions: ["Solution 1", "Solution 2"],
    tools: ["Tool 1", "Tool 2"],
  },
};
```

### Styling

- Modify `app/theme.ts` for Material UI theme customization
- Update Tailwind classes for custom styling
- Adjust responsive breakpoints as needed

## Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

### Other Platforms

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please use the contact form in the application or create an issue in the repository.
