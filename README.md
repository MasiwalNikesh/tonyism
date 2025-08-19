# Tonyism - A Life of Wisdom & Legacy

A beautiful memorial website celebrating the life, wisdom, and legacy of Tony Batra (1960-2023). This Next.js 14 application features a book-like interface with elegant animations, interactive chapters, and a chat interface that allows visitors to engage with Tony's wisdom.

## 🌟 Features

### 📖 Book-Like Experience

- **Elegant Book Cover**: Vintage leather-textured design with golden typography
- **Smooth Animations**: Framer Motion-powered page transitions and hover effects
- **Table of Contents**: Interactive chapter navigation with progress indicators
- **Page Turner Effects**: Realistic book page flipping animations

### 📚 Chapter Content

- **7 Comprehensive Chapters**:

  1. Early Life & Dreams
  2. Professional Journey
  3. Family & Relationships
  4. Legacy & Impact
  5. Memories & Tributes
  6. Philosophy & Wisdom
  7. Eternal Presence

- **Rich Content Features**:
  - Detailed biographical content
  - Inspirational quotes and wisdom
  - Interactive timelines
  - Beautiful typography and layout

### 💬 Interactive Chat

- **AI-Powered Responses**: Chat with Tony's wisdom and philosophy
- **Contextual Responses**: Intelligent responses based on Tony's teachings
- **Suggested Questions**: Pre-written questions to get started
- **Random Insights**: Daily wisdom and memories

### 🎨 Design & UX

- **Vintage Aesthetic**: Warm amber and gold color palette
- **Responsive Design**: Works beautifully on all devices
- **Smooth Transitions**: Elegant animations throughout
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Search**: Fuse.js (fuzzy search)
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel
- **Animations**: Framer Motion
- **Fonts**: Playfair Display & Source Serif Pro
- **Deployment**: Ready for Vercel deployment

## 📁 Project Structure

```
tonyism/
├── src/
│   ├── app/
│   │   ├── page.tsx (Landing/Cover)
│   │   ├── layout.tsx
│   │   ├── chapters/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx (Table of Contents)
│   │   ├── chat/
│   │   │   └── page.tsx (ChatGPT Integration)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── animations/
│   │   │   └── PageTurner.tsx
│   │   ├── book/
│   │   │   ├── BookCover.tsx
│   │   │   └── TableOfContents.tsx
│   │   └── layout/
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── chapters.ts
│   │   └── chatgpt.ts
│   └── data/
│       └── content/
├── public/
│   ├── images/
│   └── icons/
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tonyism
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Set up environment variables**
   
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your site will be live at `https://your-project.vercel.app`

### Static Export (Alternative)

For static hosting without server-side features:

```bash
npm run build
npm run export
```

Note: Chat functionality requires server-side API routes and won't work with static export.

## 📝 Content Management

### Adding New Chapters

1. Edit `src/lib/chapters.ts`
2. Add new chapter object to the `chapters` array
3. Include content, quotes, and timeline events

### Customizing Chat Responses

1. Edit `src/lib/chatgpt.ts`
2. Add new wisdom, memories, or philosophy
3. Update response logic in `generateResponse` function

### Styling Customization

- Colors: Modify amber/orange palette in `globals.css`
- Fonts: Update font imports in `layout.tsx`
- Animations: Adjust Framer Motion variants in components

## 🎨 Design System

### Color Palette

- **Primary**: Amber (#d97706)
- **Secondary**: Orange (#f59e0b)
- **Accent**: Gold (#fbbf24)
- **Background**: Warm gradients
- **Text**: Rich browns and golds

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Source Serif Pro (serif)
- **UI**: Geist Sans (system)

### Animations

- **Page Transitions**: 0.8s ease-in-out
- **Hover Effects**: 0.3s scale transforms
- **Loading States**: Bounce animations
- **Page Turns**: 3D perspective transforms

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for any API keys or configuration:

```env
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom configurations for the vintage aesthetic.

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created as a memorial website. Please respect the personal nature of this content.

## 🙏 Acknowledgments

- **Tony Batra** - For the wisdom and legacy that inspired this project
- **Next.js Team** - For the amazing framework
- **Framer Motion** - For the beautiful animations
- **Tailwind CSS** - For the utility-first styling

---

_"The measure of a life is not in its length, but in its depth and the love it leaves behind."_ - Tony Batra
