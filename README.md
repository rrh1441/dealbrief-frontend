# DealBrief Frontend

A Next.js dashboard for the DealBrief security scanner platform.

## Features

- **Single Scan**: Trigger individual domain security scans
- **Bulk Scan**: Process multiple domains via CSV upload  
- **All Scans**: View scan history and status
- **Findings**: Review security findings with filtering
- **Reports**: Generate threat snapshots and full reports
- **Verified Section**: Manage finding verification workflow

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and configure
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `DEALBRIEF_BACKEND_URL` - Your dealbrief-scanner backend URL
- `OPENAI_API_KEY` - Your OpenAI API key

See [SECRETS.md](./SECRETS.md) for detailed setup instructions.

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Connects to dealbrief-scanner API (Fly.io)
- **Database**: Supabase for findings and scan data
- **Styling**: Tailwind CSS with shadcn/ui components

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## API Integration

The frontend connects to these backend endpoints:

- `POST /scans` - Trigger single scan
- `POST /scans/bulk` - Trigger bulk scans
- `GET /scans` - Get all scans
- `GET /findings` - Get findings with filters
- `POST /reports/generate` - Generate reports

All API calls are handled through the `dealBriefAPI` service in `src/lib/dealbrief-api.ts`.
