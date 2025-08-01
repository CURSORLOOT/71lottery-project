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

// Middleware setup (pehle yeh sab load karo)
app.use(cookieParser());
app.use(express.static('public')); // Static files serve - public folder se sab load hoga
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
configViewEngine(app);

// Root route (homepage ke liye - yeh pehle add kiya taaki Not Found na aaye)
app.get('/', (req, res) => {
  console.log('Root route hit - App is live!'); // Logs mein check karne ke liye
  res.status(200).send('Hello from 71lottery! Your app is live and running on cloud. Test successful!');
});

// Init web routes (root ke baad yeh load karo)
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobContronler.cronJobGame1p(io);

// Check who connects to server
socketIoController.sendMessageAdmin(io);

// 404 handler (sab ke last mein - custom error page)
app.use((req, res, next) => {
  res.status(404).send('404 - Page Not Found! Check your URL or routes.');
});

// Start the server with log
server.listen(port, () => {
  console.log(`Server connected successfully on port: ${port}`);
});
