# 📚 NovelHub - Light Novel Community Platform

<div align="center">

![NovelHub Banner](https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=300&fit=crop)

**A modern, full-featured web application for discovering and discussing light novels from Japan, China, and Korea.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Features](#features) • [Getting Started](#getting-started) • [Tech Stack](#tech-stack)

</div>

---

## ✨ Features

### 🎨 Modern UI/UX
- **Dark Mode** - Seamless light/dark theme switching with persistent preferences
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Smooth Animations** - Polished transitions and micro-interactions
- **Intuitive Navigation** - Easy-to-use interface with clear visual hierarchy

### 📖 Novel Discovery
- **Extensive Catalog** - Browse 12+ light novels with detailed information
- **Advanced Filtering** - Filter by region (Japan, China, Korea), genre, and status
- **Smart Search** - Full-text search across titles, authors, and descriptions
- **Rich Details** - Cover images, summaries, genres, publication info, and external links

### 💬 Community Features
- **Real-time Chat** - Engage in discussions across multiple chat rooms
- **Region-specific Rooms** - Dedicated spaces for Japanese, Chinese, and Korean novels
- **Anonymous Messaging** - Participate without account requirements
- **Live Updates** - See messages appear in real-time

### 📊 Reading Management
- **Reading Lists** - Track your reading progress with multiple status options
- **Reviews & Ratings** - Read community reviews and ratings
- **Personal Notes** - Add notes and track chapters (coming soon with backend)

### 🎯 User Experience
- **Fast Performance** - Optimized loading and smooth interactions
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Progressive Enhancement** - Works without JavaScript for core features
- **SEO Optimized** - Proper meta tags and semantic HTML

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lightnovel-hub.git
   cd lightnovel-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Hot Toast](https://react-hot-toast.com/)** - Elegant notifications
- **Custom Components** - Reusable, accessible UI components

### State Management
- **React Context API** - Theme and authentication state
- **React Hooks** - Local state management
- **Custom Hooks** - Reusable logic patterns

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript** - Static type checking
- **Git** - Version control

---

## 📁 Project Structure

```
lightnovel-hub/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page with novel catalog
│   ├── search/              # Search functionality
│   ├── chat/                # Chat interface
│   ├── novel/[id]/          # Dynamic novel detail pages
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── auth/               # Authentication components
│   ├── chat/               # Chat-related components
│   ├── filters/            # Filter sidebar and controls
│   ├── layout/             # Layout components (Navbar, Footer)
│   ├── novels/             # Novel display components
│   └── ui/                 # UI primitives and utilities
├── contexts/               # React context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Dark mode theme state
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configs
│   ├── mock-data/         # Mock data for demo
│   └── supabase.ts        # Supabase client (for future backend)
├── types/                  # TypeScript type definitions
│   └── database.types.ts  # Database schema types
└── public/                 # Static assets
```

---

## 🎨 Key Features Showcase

### Dark Mode Implementation
```typescript
// Persistent theme with system preference detection
const [theme, setTheme] = useState<Theme>('light')

useEffect(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    setTheme(savedTheme)
  } else if (prefersDark) {
    setTheme('dark')
  }
}, [])
```

### Advanced Filtering
```typescript
// Multi-criteria filtering with real-time updates
const filteredNovels = novels
  .filter(novel => selectedRegions.includes(novel.region_id))
  .filter(novel => selectedStatus.includes(novel.status))
  .filter(novel => novel.novel_genres.some(ng => 
    selectedGenres.includes(ng.genres.id)
  ))
```

### Responsive Design
```css
/* Mobile-first approach with Tailwind */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Novel cards */}
</div>
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Click "Deploy"
4. Your app is live! 🎉

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

---

## 🔮 Future Enhancements

### Backend Integration (Supabase)
- [ ] User authentication and profiles
- [ ] Real database with persistent data
- [ ] User-generated reviews and ratings
- [ ] Personal reading lists with sync
- [ ] Real-time chat with message history

### Additional Features
- [ ] Advanced search with filters
- [ ] Recommendation engine
- [ ] User profiles and avatars
- [ ] Bookmarking and favorites
- [ ] Email notifications
- [ ] Social sharing
- [ ] Mobile app (React Native)

---

## 📸 Screenshots

### Light Mode
![Home Page Light](https://via.placeholder.com/800x450/ffffff/000000?text=Home+Page+Light+Mode)

### Dark Mode
![Home Page Dark](https://via.placeholder.com/800x450/1f2937/ffffff?text=Home+Page+Dark+Mode)

### Novel Detail
![Novel Detail](https://via.placeholder.com/800x450/ffffff/000000?text=Novel+Detail+Page)

### Chat Interface
![Chat](https://via.placeholder.com/800x450/ffffff/000000?text=Chat+Interface)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Suleiman Abdulrahman**

- Portfolio: [yourportfolio.com](https://suleiman-cipher.vercel.app)
- GitHub: [@yourusername](https://github.com/cypher682)
- Email: cipherorion682@gmail.com

---

## 🙏 Acknowledgments

- Novel data and inspiration from various light novel communities
- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

---

## 📊 Project Stats

- **12** Light Novels
- **15** Genres
- **3** Regions (Japan, China, Korea)
- **4** Chat Rooms
- **100%** TypeScript
- **0** Runtime Errors

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and ☕

</div>
