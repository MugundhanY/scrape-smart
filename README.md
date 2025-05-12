# ScrapeSmart

<div align="center">
  <img src="public/images/readme-banner.svg" alt="ScrapeSmart Logo" width="800" />
</div>

ScrapeSmart is a powerful web scraping platform that enables you to build, automate, and schedule complex data extraction workflows through an intuitive drag-and-drop interface - no coding required.

## Features

### Visual Workflow Builder
Build sophisticated web scraping workflows with our intuitive drag-and-drop interface. Connect nodes to create powerful automation sequences without writing a single line of code.

### Integrated Browser Automation
Complete control over browser interactions with specialized automation nodes:
- **Launch Browser** - Start a headless browser instance
- **Navigate URL** - Direct the browser to specific web pages
- **Fill Input** - Enter text into forms and search boxes
- **Click Element** - Interact with buttons and links
- **Scroll to Element** - Ensure visibility of elements before scraping
- **Wait for Element** - Add timing control to your workflows

### Advanced Data Extraction
Extract structured data using multiple methods:
- **Get HTML from Page** - Capture raw HTML for processing
- **Extract Text from Element** - Target specific elements on the page
- **Extract Data with AI** - Leverage AI to parse complex data patterns
- **Read Property from JSON** - Extract specific data from JSON structures
- **Add Property to JSON** - Augment your data during processing

### AI-Powered Extraction
Extract structured data with leading AI models:
- **OpenAI GPT-4o** - State-of-the-art text analysis
- **Google Gemini 2.0 Flash** - Fast and accurate extraction
- **Anthropic Claude** - Specialized in complex data extraction

### Secure Credential Management
Store API keys and authentication tokens securely with enterprise-grade encryption.

### Scheduled Automation
Set up recurring scrapes on your preferred schedule with our intuitive cron-based scheduler.

## Technology Stack

ScrapeSmart is built on a modern, robust technology stack:

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Prisma ORM
- **Browser Automation**: Puppeteer
- **AI Integration**: OpenAI, Google Gemini, Anthropic Claude
- **Scheduling**: Cron-based scheduling with Vercel's built-in cron jobs
- **Security**: AES-256 encryption for credential storage

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scrape-smart.git
cd scrape-smart
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up your environment variables (see `.env.example`)

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating Your First Workflow

1. Navigate to the Workflows section in the dashboard
2. Click "Create Workflow" and give it a name
3. Use the visual editor to add nodes:
   - Start with a "Launch Browser" node
   - Add interaction nodes (Navigate URL, Fill Input, etc.)
   - Add data extraction nodes
   - Connect nodes by dragging between input and output handles
4. Test your workflow by clicking "Run"
5. View results in the Runs tab

### Scheduling Workflows

1. Create and test your workflow
2. Click the schedule button on your workflow card
3. Enter a cron expression or use our scheduler helper
4. Save to activate the schedule

## Deployment

ScrapeSmart is optimized for deployment on Vercel:

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

Vercel will automatically set up the necessary infrastructure, including cron jobs for scheduled workflows.

## Documentation

For more detailed documentation on specific features and use cases, check out our docs:

- [Cron Implementation Details](docs/cron-implementation.md)
- [Puppeteer on Vercel](docs/puppeteer-vercel.md)
- [Vercel Cron Usage](docs/vercel-cron-usage.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
