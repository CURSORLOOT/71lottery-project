import express from 'express';
import configViewEngine from './config/configEngine';
import routes from './routes/web';
import cronJobContronler from './controllers/cronJobContronler';
import socketIoController from './controllers/socketIoController';
require('dotenv').config();
let cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// Middleware setup
app.use(cookieParser());
app.use(express.static('public')); // Static files serve (uncommented and placed early)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
configViewEngine(app);

// Init web routes
routes.initWebRouter(app);

// Simple root route for homepage (to fix "Not Found" on Render)
app.get('/', (req, res) => {
  res.send('Hello from 71lottery! Your app is live on Render.');
});

// Cron game 1 Phut
cronJobContronler.cronJobGame1p(io);

// Check who connects to server
socketIoController.sendMessageAdmin(io);

// 404 handler (placed at the end to catch all unmatched routes)
app.all('*', (req, res) => {
  return res.render("404.ejs");
});

// Start the server
server.listen(port, () => {
  console.log("Connected success port: " + port);
});
