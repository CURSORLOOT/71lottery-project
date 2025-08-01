import express from 'express';
import configViewEngine from './config/configEngine';
import routes from './routes/web';
import cronJobContronler from './controllers/cronJobContronler';
import socketIoController from './controllers/socketIoController';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; // ESM style mein change kiya

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

// Root route for homepage (Vercel pe 404 fix ke liye strong kiya)
app.get('/', (req, res) => {
  console.log('Root route hit - App is live on Vercel!');
  res.status(200).send('Hello from 71lottery! Your app is live on Vercel. Test successful!');
});

// Init web routes
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobContronler.cronJobGame1p(io);

// Check who connects to server
socketIoController.sendMessageAdmin(io);

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found on Vercel');
});

// Start server (local ke liye), but for Vercel export app
server.listen(port, () => {
  console.log(`Server connected on port: ${port}`);
});

// Vercel serverless ke liye app export (yeh important fix hai)
module.exports = app;
