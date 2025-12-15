# Next Movie

A movie discovery app built with Next.js 16 and the TMDB API. Browse popular and top-rated movies, search, and explore by genre.

## Features

- Browse popular and top-rated movies
- Search movies by title
- Filter movies by genre
- View movie details and cast
- Server-side rendering with Next.js App Router

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **API:** TMDB (The Movie Database)

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- TMDB API access token ([get one here](https://www.themoviedb.org/settings/api))

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file based on `example.env`:

```env
TMDB_TOKEN=your_tmdb_access_token
```

### Running the App

```bash
# Development server
npm run dev
```

The app runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
app/
├── genre/[name]/     # Genre filtered movies
├── movie/[id]/       # Movie details page
├── person/[id]/      # Person/actor details
├── search/           # Search results
├── layout.tsx        # Root layout with sidebar
├── page.tsx          # Home page (popular & top rated)
└── loading.tsx       # Loading state
components/
├── ui/               # shadcn/ui components
└── movie.tsx         # Movie card component
types/
└── global.ts         # TypeScript types
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home - Popular & top-rated movies |
| `/movie/[id]` | Movie details |
| `/genre/[name]/[id]` | Movies by genre |
| `/person/[id]` | Person details |
| `/search?q=` | Search results |
