# NovelHub - Light Novel Community App

A modern web application for discovering and discussing light novels from Japan, China, and Korea. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Novel Discovery**: Browse and search thousands of light novels
- **Community Chat**: Real-time chat rooms for discussions
- **Reading Lists**: Track your reading progress
- **Reviews & Ratings**: Share your thoughts on novels
- **Mobile-First**: Responsive design that works on all devices
- **PWA Support**: Install as an app on your device

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Hosting**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server: `npm run dev`
5. Set up the Supabase database using the provided SQL schema

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL commands from the setup guide to create tables
3. Enable Row Level Security (RLS) policies
4. Configure authentication settings

## Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Features in Detail

### Authentication
- Email/password registration and login
- Profile management
- Anonymous user limitations

### Novel Management
- Comprehensive novel database
- Genre and region filtering
- Status tracking (ongoing, completed, etc.)
- External links to official and translation sites

### Community Features  
- Real-time chat rooms
- Region-specific discussions
- Novel-specific chat rooms
- User reviews and ratings

### Mobile Experience
- Responsive design
- PWA capabilities
- Touch-friendly interface
- Offline support (planned)

## Contributing

Feel free to submit issues and pull requests to improve the application.

## License

This project is licensed under the MIT License.
