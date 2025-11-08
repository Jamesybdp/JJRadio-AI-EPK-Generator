<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JJRadio AI EPK Generator

This project is an AI-powered Electronic Press Kit (EPK) generator for musicians. It allows artists to input information about their track, including lyrics, genre, and cultural references, and then generates a comprehensive EPK that includes an artist bio, a one-sheet summary, social media captions, and strategic guidance for submissions.

## Features

- **AI-Powered Content Generation**: Utilizes AI to generate high-quality, professional EPK content.
- **Comprehensive EPK**: Creates a complete EPK with all the necessary components for music promotion.
- **Strategic Guidance**: Provides artists with targeted recommendations for sync libraries, grants, and radio stations.
- **PDF Export**: Allows users to download their generated EPK as a professional-looking PDF.
- **Secure Authentication**: Protects user data with a secure login system.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: (Assumed) Node.js, Express, Google Gemini API
- **Deployment**: (Assumed) Vercel, Netlify, or similar platform

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/jjradio-ai-epk-generator.git
    cd jjradio-ai-epk-generator
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following:

    ```
    VITE_API_BASE_URL=http://localhost:3000
    ```

    *Note: You may also need to set up a `GEMINI_API_KEY` if you are running the backend locally.*

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  **Open your browser:**

    Navigate to `http://localhost:5173` to view the application.

## Usage

1.  **Login**: Authenticate with your email and password.
2.  **Fill out the form**: Provide all the required information about your track.
3.  **Generate EPK**: Click the "Generate EPK" button to start the process.
4.  **Review and Download**: Once the EPK is generated, you can review the content and download it as a PDF.

## Project Structure

```
.
├── public/
├── src/
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── InputField.tsx
│   │   ├── Loader.tsx
│   │   ├── ResultCard.tsx
│   │   ├── TextAreaField.tsx
│   │   └── icons.tsx
│   ├── services/
│   │   ├── apiService.ts
│   │   └── authService.ts
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── types.ts
├── .env.local.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```
