# Job Board Scraper (In Development)

## Tech Stack

### Backend
- **Python Playwright** - Used for web scraping job postings from various sources.

### Database
- **Supabase** - Serves as the database for storing scraped job listings.

### Frontend
- **Next.js** - Handles the UI and retrieves job data from the backend.

## How It Works

1. **Scraping:** The backend uses Playwright to extract job listings from target websites.
2. **Storage:** The scraped data is stored in Supabase for easy retrieval.
3. **Frontend Display:** The Next.js frontend queries the database and displays job listings dynamically.

## Features

- Automated job listing retrieval
- Database storage for structured job data
- Web-based frontend for job discovery
