# 🎓 Result Wallah - Educational Institute Website

A modern, full-stack website for Result Wallah coaching institute in Karad, Maharashtra. Built with Next.js 14, MongoDB, and Tailwind CSS.

## 🌟 Features

### Public Website
- **Homepage** with multiple sections:
  - Scrolling announcement bar
  - Hero section with course offerings
  - Founder & Director profiles
  - Course listings (JEE, NEET, MHT-CET, XI & XII Board)
  - Top Performers showcase
  - Student gallery
  - Contact form
  - Responsive design with Royal Blue theme

### Admin Panel (`/admin`)
- **Dashboard** with real-time statistics
- **Staff Management** - Add, edit, delete faculty members
- **Course Management** - Manage course offerings
- **Banner Management** - Control homepage banner carousel
- **Announcement Bar** - Update scrolling announcements
- **Gallery Management** - Manage student photo gallery
- **Contact Form Submissions** - View inquiry submissions
- Secure authentication

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API Routes
- **Database:** MongoDB (local) / MongoDB Atlas (production)
- **Authentication:** JWT-based admin authentication
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local) or MongoDB Atlas account
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd result-wallah
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection details:
```env
MONGO_URL=mongodb://localhost:27017  # or your MongoDB Atlas URL
DB_NAME=resultwallah
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
```

4. Run the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Admin Access

- **URL:** `/admin`
- **Email:** `admin@resultwallah.com`
- **Password:** `Result@2026`

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js  # All API endpoints and MongoDB models
│   ├── admin/page.js              # Admin panel
│   ├── login/page.js              # Admin login
│   ├── page.js                    # Homepage
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── lib/
│   └── mongodb.js                 # MongoDB connection utility
├── .env                           # Environment variables
├── .env.example                   # Environment template
└── package.json
```

## 🌐 Deployment to Vercel

See the complete guide in [`VERCEL_DEPLOYMENT_GUIDE.md`](./VERCEL_DEPLOYMENT_GUIDE.md)

**Quick steps:**
1. Set up MongoDB Atlas
2. Push code to GitHub using "Save to Github"
3. Import project to Vercel
4. Add environment variables
5. Deploy!

## 🔧 Available Scripts

```bash
# Development server with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🎨 Theme

The website uses a custom Royal Blue gradient theme with:
- Primary: Royal Blue (#1e3a8a to #1e40af)
- Accent: Gold highlights
- Background: White with subtle gradients

## 📊 Database Models

- **staff** - Faculty and leadership information
- **courses** - Course offerings
- **results** - Top performer achievements
- **announcements** - Scrolling announcement bar content
- **banners** - Homepage banner carousel
- **gallery** - Student photo gallery
- **contacts** - Contact form submissions
- **users** - Admin users

## 🔄 Data Seeding

The database automatically seeds with initial data on first run. Seeding is locked to prevent duplicate data.

To re-seed, drop the `seed_locks` collection:
```javascript
db.collection('seed_locks').drop()
```

## 📱 Responsive Design

Fully responsive across:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Known Issues

None at this time.

## 🚧 Upcoming Features

- Student Portal with OTP login
- PDF Notes download system
- Testimonial carousel
- Detailed course pages
- SEO management in admin panel
- Student result tracking

## 📝 License

Private project for Result Wallah coaching institute.

## 👥 Contact

**Result Wallah**
- Address: Karad - Vita Rd, near JK Petrol Pump, Saidapur, Karad, Maharashtra 415124
- Phone: +91 9156781002, +91 9156782003
- Facebook: [Result Wallah](https://www.facebook.com/p/Result-Wallah-61573986368335)
- Instagram: [@resultwallah7](https://www.instagram.com/resultwallah7)

---

**Built with ❤️ for Result Wallah**
