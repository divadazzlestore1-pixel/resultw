import './globals.css'

export const metadata = {
  title: 'Result Wallah - Best JEE, NEET & MHT-CET Coaching in Karad',
  description: 'Result Wallah is the top coaching institute in Karad, Maharashtra for JEE, NEET, MHT-CET preparation. Expert faculty, limited batches of 50 students, AI-powered classrooms. Transform your aspirations into achievements.',
  keywords: 'NEET Coaching, JEE Coaching, MHT-CET Coaching, Best Coaching in Karad, NEET Classes Karad, JEE Classes Karad, Medical Entrance Coaching, Engineering Entrance Coaching, NEET Preparation, JEE Preparation, NEET Online Classes, JEE Online Classes, NEET Offline Classes, JEE Offline Classes, NEET Coaching in Karad, JEE Coaching in Karad, Best NEET Coaching in Karad for Biology, Top JEE Coaching in Karad for Physics, NEET Coaching with Experienced Faculty in Karad, JEE Coaching with Affordable Fees in Karad, NEET Coaching with Mock Tests',
  authors: [{ name: 'Result Wallah' }],
  creator: 'Result Wallah',
  publisher: 'Result Wallah',
  openGraph: {
    title: 'Result Wallah - Best JEE, NEET & MHT-CET Coaching in Karad',
    description: 'Top coaching institute in Karad for JEE, NEET, MHT-CET. Expert faculty, limited batches, AI-powered classrooms.',
    url: 'https://resultwallah.com',
    siteName: 'Result Wallah',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Result Wallah - Best JEE, NEET & MHT-CET Coaching in Karad',
    description: 'Top coaching institute in Karad for JEE, NEET, MHT-CET preparation.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://resultwallah.com',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Result Wallah",
  "description": "Premier coaching institute in Karad for JEE, NEET, and MHT-CET preparation",
  "url": "https://resultwallah.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Karad - Vita Rd, near JK Petrol Pump, Saidapur",
    "addressLocality": "Karad",
    "addressRegion": "Maharashtra",
    "postalCode": "415124",
    "addressCountry": "IN"
  },
  "telephone": "+919156781002",
  "sameAs": [
    "https://www.facebook.com/p/Result-Wallah-61573986368335",
    "https://www.instagram.com/resultwallah7"
  ],
  "teaches": [
    "JEE Main", "JEE Advanced", "NEET UG", "MHT-CET", "Foundation Courses"
  ]
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
