# Alzikrayat - MERN Edition (Full-Stack Photo Sharing Application)

## Overview
Full-stack photo-sharing application built with MongoDB, Express.js, React (Vite), and Node.js.

## Features
- User Registration & Login with bcrypt password hashing and Joi server-side validation
- Public Community Gallery with Grid and List view toggle
- Photo Upload (Multer) & Owner-only Deletion
- Photo Detail View (`/photos/:id`) with real-time Commenting Engine

## Environment Variables (`server/.env`)
- `PORT=5000`
- `MONGO_URI=<your_mongodb_atlas_uri>`
- `JWT_SECRET=<your_jwt_secret>`

## Local Setup
1. Backend: `cd server && npm install && node server.js`
2. Frontend: `cd client && npm install && npm run dev`
