# Property Dealer CRM System - Assignment 3

**Course:** CS-4032 Web Programming  
**Assignment:** Assignment 3 - Full-Stack CRM System

A comprehensive full-stack Customer Relationship Management (CRM) system built for property dealers in Pakistan. This system helps real estate agents efficiently manage leads from multiple sources including Facebook Ads, walk-in clients, and website inquiries.

## Features

### Core Features
- **Authentication System**: Secure signup/login with JWT tokens and password hashing
- **Role-Based Access Control**: Admin (full access) and Agent (limited access to assigned leads)
- **Lead Management**: Full CRUD operations for leads
- **Lead Scoring**: Automatic priority assignment based on budget (High: >20M, Medium: 10M-20M, Low: <10M)
- **Lead Assignment**: Admin can assign/reassign leads to agents
- **Real-time Updates**: Socket.io integration for live updates
- **Activity Timeline**: Complete audit trail for all lead activities
- **Smart Follow-up System**: Track follow-up dates and detect overdue leads
- **Analytics Dashboard**: Admin insights on lead distribution and agent performance
- **WhatsApp Integration**: Click-to-chat functionality with proper international formatting
- **Email Notifications**: Automated emails for new leads and assignments

### Middleware
- **Validation Middleware**: Request body and query parameter validation using Zod
- **Authentication Middleware**: JWT token verification for protected routes
- **Rate Limiting**: 50 requests/minute for agents, unlimited for admins

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string
- Gmail account with App Password for email notifications (optional)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   
   Copy `env.local` to `.env.local` and update the following variables:
   
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/property-crm
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-key-change-this-in-production
   
   # Email Configuration (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=Property CRM <noreply@propertycrm.com>
   
   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   **Note**: For Gmail, you need to create an App Password:
   - Go to Google Account Settings > Security
   - Enable 2-Step Verification
   - Generate an App Password for mail
   - Use this app password in `EMAIL_PASSWORD`

3. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo mongod
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   
   - First time: Sign up as an admin
   - Subsequent logins: Use the login page

## Usage

### Admin Workflow
1. Sign up as admin (select "admin" role)
2. Dashboard shows analytics and agent performance
3. View all leads in "Manage Leads"
4. Assign leads to agents
5. Monitor agent performance through analytics

### Agent Workflow
1. Sign up as agent (select "agent" role)
2. Dashboard shows assigned leads
3. Create new leads
4. View lead details and update status
5. Set follow-up dates
6. Use WhatsApp integration to contact clients
7. Track activities through timeline

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Leads
- `GET /api/leads` - Get all leads (filtered by role)
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get single lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead (admin only)
- `GET /api/leads/[id]/activities` - Get lead activity timeline

### Analytics
- `GET /api/analytics` - Get analytics data (admin only)

### Users
- `GET /api/users` - Get all users (admin only)

## Database Schema

### User Model
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'agent',
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model
```typescript
{
  name: string,
  email: string,
  phone: string,
  propertyInterest: string,
  budget: number,
  status: 'new' | 'contacted' | 'in_progress' | 'closed' | 'lost',
  priority: 'high' | 'medium' | 'low',
  score: number,
  notes: string,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  followUpDate: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Model
```typescript
{
  leadId: ObjectId (ref: Lead),
  userId: ObjectId (ref: User),
  userName: string,
  action: ActivityType,
  details: string,
  previousData: Record<string, any>,
  newData: Record<string, any>,
  createdAt: Date
}
```

## Lead Scoring Logic

The system automatically assigns priority and score based on budget:
- **High Priority (Score: 100)**: Budget > 20,000,000 PKR
- **Medium Priority (Score: 50)**: Budget 10,000,000 - 20,000,000 PKR
- **Low Priority (Score: 25)**: Budget < 10,000,000 PKR

## Project Structure

```
assignment-3/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── leads/        # Lead CRUD endpoints
│   │   │   ├── analytics/    # Analytics endpoint
│   │   │   └── users/        # Users endpoint
│   │   ├── admin/            # Admin pages
│   │   ├── agent/            # Agent pages
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── page.tsx          # Home page (redirect)
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities
│   │   ├── mongodb.ts        # MongoDB connection
│   │   ├── jwt.ts            # JWT utilities
│   │   ├── email.ts          # Email utilities
│   │   └── socket.ts         # Socket.io setup
│   ├── middleware/           # Middleware
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── validation.ts     # Validation middleware
│   │   └── rateLimit.ts      # Rate limiting middleware
│   ├── models/               # Mongoose models
│   │   ├── User.ts
│   │   ├── Lead.ts
│   │   └── ActivityLog.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── env.local                 # Environment variables template
└── package.json
```

## Security Considerations

1. **Password Security**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Tokens expire after 7 days
3. **Rate Limiting**: Agents limited to 50 requests/minute
4. **Role-Based Access**: Strict separation between admin and agent permissions
5. **Input Validation**: All inputs validated using Zod schemas
6. **SQL Injection Prevention**: Using MongoDB with Mongoose ORM prevents SQL injection

## Future Enhancements

- AI-based follow-up suggestions
- Export leads to Excel/PDF
- Advanced filtering and search
- File upload for documents
- Calendar integration
- Mobile app version
- Multi-language support

## License

This project is created for academic purposes (CS-4032 Web Programming Assignment).

## Author

Built as Assignment 3 for CS-4032 Web Programming course.
