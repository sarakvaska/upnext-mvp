## 📁 Suggested File Structure

This structure reflects the layout inside the `upnext-mvp` repo:

```sh
upnext-mvp/
├── upnext/             # Main application source code
│   ├── app/            # App logic (pages, views, routes)
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions/helpers
│   ├── styles/         # Tailwind/global styles
│   ├── api/            # API route handlers (if applicable)
│   ├── prisma/         # ORM config (if using Prisma)
│   ├── supabase/       # Supabase client/config
│   ├── public/         # Static assets
│   └── README.md       # App-level documentation
│
├── upnext-docs/        # Internal project documentation
│   ├── .cursorrules
│   ├── DEV_GUIDELINES.md
│   ├── FILE_STRUCTURE.md
│   ├── PRD.md
│   ├── TECH_STACK.md
│   └── README.md       # Docs folder overview
│
└── README.md           # Top-level overview of the entire repo
```