# ShareReads

A modern full-stack peer-to-peer book sharing and reading community platform built with Next.js, Express, PostgreSQL, and Socket.io.

---

## Overview

ShareReads allows users to:

- Share books they own  
- Request to borrow books  
- Communicate via real-time transaction-based chat  
- Join small reading circles (5–8 members)  
- Track reading progress collaboratively  
- Browse books by genre  
- Build personalized reader profiles  

This project demonstrates full-stack architecture, real-time systems, relational database design, and modern SaaS UI development.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Real-Time
- Socket.io

### Authentication
- JWT
- bcrypt

### Deployment
- Frontend: Vercel  
- Backend: Railway / Render  
- Database: Neon PostgreSQL  

---

## Core Features

### Authentication
- Secure registration and login  
- JWT-based protected routes  

### Book Management
- Global book metadata  
- Genre-based categorization  
- User-owned book copies  
- Availability tracking  

### Borrow Workflow
Pending → Approved → Borrowed → Returned

### Transaction Chat
- Real-time messaging  
- Activated after request approval  
- Linked to specific borrow request  

### Reading Circles
- 5–8 members per group  
- Real-time group chat  
- Reading progress tracking  
- Group progress average display  

### User Profiles
- Books shared  
- Books borrowed  
- Top 5 recommended books  
- Favorite author and genres  

---

## Project Structure

### Backend
```
src/
├── controllers/
├── routes/
├── middleware/
├── services/
├── sockets/
├── prisma/
└── utils/
```

### Frontend
```
app/
├── auth/
├── dashboard/
├── books/
├── circles/
└── profile/

components/
├── layout/
├── book/
├── chat/
├── circle/
└── ui/
```


---

## Development Phases

1. Authentication  
2. Books + Genres  
3. Borrow Workflow  
4. Transaction Chat  
5. Reading Circles  
6. Profile System  
7. UI and Animation Polish  

---



This project showcases:

- Full-stack system architecture  
- Real-time communication using Socket.io  
- Relational database modeling with Prisma  
- Secure authentication practices  
- Modular frontend architecture  
- Modern dark-themed SaaS UI  

---

## Future Enhancements

- Reviews and ratings  
- Notifications  
- OAuth login  
- Admin moderation panel  
- Recommendation engine  

---