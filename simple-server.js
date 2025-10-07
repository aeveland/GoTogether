import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Handle React routing - send all other requests to React
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
  res.sendFile(indexPath);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple GoTogether server running on port ${PORT}`);
});
