const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4001;
const DATA_FILE = path.join(__dirname, 'roadmap-progress.json');

app.use(cors());
app.use(express.json());

// Helper to read/write progress data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get roadmap progress for a user
app.get('/api/progress', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const data = readData();
  res.json(data[userId] || null);
});

// Save roadmap progress for a user
app.post('/api/progress', (req, res) => {
  const { userId, roadmapConfig, roadmapData } = req.body;
  if (!userId || !roadmapConfig || !roadmapData) {
    return res.status(400).json({ error: 'userId, roadmapConfig, and roadmapData required' });
  }
  const data = readData();
  data[userId] = { roadmapConfig, roadmapData };
  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Roadmap Progress API running on http://localhost:${PORT}`);
}); 