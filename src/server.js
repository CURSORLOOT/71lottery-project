import express from 'express';
import configViewEngine from './config/configEngine';
import routes from './routes/web';
import cronJobContronler from './controllers/cronJobContronler';
import socketIoController from './controllers/socketIoController';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// Middleware setup
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
configViewEngine(app);

// Root route: Direct login page pe redirect karo (user ko seedha bhej do)
app.get('/', (req, res) => {
  console.log('Root route hit - Redirecting to login!');
  res.redirect('/login'); // Agar tera login route /login nahi hai toh yahan change kar (jaise '/auth/login')
});

// Init web routes
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobContronler.cronJobGame1p(io);

// Check who connects to server
socketIoController.sendMessageAdmin(io);

// 404 handler (simple text rakha, rename nahi kiya - sab unmatched routes pe yeh show hoga)
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found! Check your URL.');
});

// Start server
server.listen(port, () => {
  console.log(`Server connected on port: ${port}`);
});

// Vercel ke liye export (serverless ke liye)
module.exports = app;
