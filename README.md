# 🇮🇳 Incredibo 

*Made by Indians for India!!*

Incredibo is a dynamic travel platform designed to explore India's rich heritage. It features **Yatri**, an intelligent 24/7 AI guide that uses your camera to identify monuments and answer your questions in real-time. Complete with interactive maps, detailed destination databases, and role-based contributions, Incredibo is the ultimate companion for your journey across India.

---

## 🚀 Key Features

*   **Yatri AI Guide:** A 24/7 virtual assistant powered by Google Gemini. Simply upload or point your camera at a monument, and Yatri will identify it, recount its history, and answer your questions via text or voice.
*   **Interactive Maps:** Visually explore destinations across India using integrated Leaflet maps with pinned locations and quick-view popups.
*   **Curated Destination Database:** Browse detailed profiles for historical monuments, including history, timings, entry fees, exact coordinates, and high-quality imagery.
*   **Role-Based Access Control:** Secure authentication separating standard **Visitors** and authorized **Guides**. Guides have the ability to expand the database by registering new locations.
*   **Secure Authentication:** Features JWT-based session management, refresh tokens, and robust OTP email verification for password resets and account activation.
*   **Modern UI/UX:** A stunning, responsive frontend built with glassmorphism design principles, smooth Framer Motion animations, and Tailwind CSS.

---

## 💻 Tech Stack

**Frontend:**
*   React.js
*   Tailwind CSS (Styling)
*   Framer Motion (Animations)
*   React Router (Navigation)
*   React Leaflet (Maps)
*   Lucide React / FontAwesome (Icons)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Dual database setup for Main & Auth)
*   Google Gemini AI (Vision & Chat capabilities)
*   Cloudinary (Image storage & optimization)
*   Nodemailer & OAuth2 (OTP email delivery)
*   JSON Web Tokens (JWT) & bcrypt (Security)

---

## 🛠️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB (Local or Atlas URL)
*   API Keys for Gemini, Cloudinary, and Google OAuth2

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/incredibo.git](https://github.com/yourusername/incredibo.git)
   cd incredibo
