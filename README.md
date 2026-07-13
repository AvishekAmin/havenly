# 🏡 Havenly

## A Travel & Accommodation Booking Platform

Havenly is a modern full-stack travel and accommodation booking platform designed to connect travelers with exceptional places to stay. Users can explore destinations, discover unique properties, create and manage listings, share reviews, and navigate locations through interactive maps.

Powered by the MERN stack and modern web technologies, Havenly offers a secure, scalable, and responsive experience with authentication, cloud-based image management, interactive maps, advanced search, review management, and an elegant user interface inspired by contemporary booking platforms.

---

# 🌐 Live Demo

🔗 **Website:** https://havenly-z7ym.onrender.com/listings

---

# 🎯 Key Features

- 🔐 Secure Authentication (Passport.js)

- 🏡 Property Listing & Management

- ⭐ Ratings & Reviews

- 🗺️ Interactive Mapbox Maps

- ☁️ Cloudinary Image Uploads

- 📱 Fully Responsive UI

- 🔍 Smart Property Search

- 💳 Reservation & Payment Flow

- 🌱 Automated Review Seeder

- 🚀 RESTful MVC Architecture

---

# 📷 Screenshots

## 1. Home Page
![Home Page](./screenshots/home-page.png)

## 2. Show Page
![Show Page](./screenshots/show-page.png)

## 3. Create Listing
![Create Listing](./screenshots/create-listing.png)

## 4. Edit Listing
![Edit Listing](./screenshots/edit-listing.png)

## 5. Review Listing
![Review Listing](./screenshots/review-listing.png)

## 6. Login Page
![Login Page](./screenshots/login-page.png)

## 7. Signup Page
![Signup Page](./screenshots/signup-page.png)

## 8. Map Location
![Map Location](./screenshots/map-location.png)

## 9. Payment Page
![Payment Page](./screenshots/payment-page.png)

---

# ✨ Features

## 🔐 Authentication & Security

- User Registration & Login
- Secure Authentication with Passport.js
- Session Management using Connect-Mongo
- Protected Routes & Authorization
- Flash Messages for User Feedback

## 🏡 Property Listings

- Create, Edit & Delete Listings
- View Detailed Property Information
- Property Owner Authorization
- Responsive Listing Cards
- Premium Show Page Layout

## 🔍 Search & Discovery

- Search Properties by Destination
- Modern Search Bar Interface
- Interactive Booking Widget
- Sticky Reservation Card

## 🖼️ Media Management

- Upload Property Images
- Cloudinary Cloud Storage Integration
- Optimized Image Delivery
- High-Quality Responsive Images

## 🗺️ Maps & Location Services

- Interactive Maps using Mapbox GL JS
- Automatic Location Geocoding
- Property Location Visualization

## ⭐ Reviews & Ratings

- Add & Delete Reviews
- Star Rating System
- Realistic Demo Review Seeder
- Review Modal with "Show All Reviews"

## 🛏️ Property Amenities

- Amenities Overview
- "Show All Amenities" Modal
- Premium Property Information Cards

## 💳 Booking Experience

- Check-in & Check-out Selection
- Guest Selection
- Reservation Summary
- Payment Page Workflow

## 📄 Informational Pages

- About Us
- Help Center
- Safety Information
- Cancellation Policy
- Contact Us
- Careers
- Press
- Terms & Privacy

## 💻 User Experience

- Fully Responsive Design
- Mobile-Friendly Interface
- Modern Glassmorphism UI
- Bootstrap 5 Components
- Interactive Animations
- Server-Side Validation
- Clean MVC Architecture

---

# 🚀 Tech Stack

## 🖌️ Frontend

- HTML5
- CSS3
- Bootstrap
- EJS
- JavaScript

## ⚙️ Backend

- Node.js
- Express.js

## 🗄️ Database

- MongoDB Atlas
- Mongoose ODM

## 🔐 Authentication & Storage

- Passport.js
- Cloudinary
- Multer
- Connect-Mongo

## 🗺️ APIs & Integrations

- Mapbox Geocoding API
- Mapbox GL JS

---

# 📁 Project Highlights

✅ Full-Stack MERN-Based Web Application

✅ Secure Authentication & Authorization

✅ Complete CRUD Functionality

✅ Cloudinary Image Upload & Storage

✅ Interactive Mapbox Maps & Geocoding

✅ Smart Property Search Experience

✅ Premium Property Detail Pages

✅ Reservation & Booking Workflow

✅ Reviews, Ratings & Amenities Management

✅ Automated Demo Review Seeder

✅ RESTful MVC Architecture

✅ Responsive & Mobile-First Design

✅ Session Management with MongoDB

✅ Modern Glassmorphism UI/UX

---

# 🔑 Installation

```bash
git clone https://github.com/AvishekAmin/havenly.git

cd havenly

npm install

npm run dev
```

---

## 🌱 Seed Demo Reviews

Generate realistic demo reviews for all listings.

```bash
node init/seedReviews.js
```

This script:

- Deletes all existing reviews
- Clears review references from listings
- Generates fresh realistic reviews
- Automatically links reviews to their listings

---

# 🛠️ Environment Variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string

SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
```

---

## 📁 Project Structure

```text
havenly/
│
├── controllers/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── init/
│   ├── data.js
│   ├── index.js
│   └── seedReviews.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   └── js/
│       ├── map.js
│       └── script.js
│
├── routes/
│   ├── listing.js
│   ├── pages.js
│   ├── review.js
│   └── user.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── payment.ejs
│   │   └── show.ejs
│   │
│   ├── pages/
│   │   ├── about.ejs
│   │   ├── cancellation.ejs
│   │   ├── careers.ejs
│   │   ├── contact.ejs
│   │   ├── help.ejs
│   │   ├── press.ejs
│   │   ├── privacy.ejs
│   │   └── safety.ejs
│   │
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   └── error.ejs
│
├── screenshots/
│   ├── home-page.png
│   ├── show-page.png
│   ├── create-listing.png
│   ├── edit-listing.png
│   ├── review-listing.png
│   ├── login-page.png
│   ├── signup-page.png
│   ├── map-location.png
│   └── payment-page.png
│
├── .env
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package-lock.json
├── package.json
├── README.md
└── schema.js
```

---

# 👨‍💻 Author

## Avishek Amin

🔗 **LinkedIn:** https://www.linkedin.com/in/avishekamin

🔗 **Email:** avishekamin207@gmail.com

🔗 **GitHub:** https://github.com/AvishekAmin

---

### ⭐ **If you like this project, consider giving it a star!**

---