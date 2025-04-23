const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory data (replace JSON files)
const students = [
  { id: '12345', name: 'John Doe', domain: 'AI' },
  { id: '67890', name: 'Jane Smith', domain: 'Full Stack Development' }
];

const questions = [
  // Sample questions (add all 100 questions here as provided earlier)
  { id: 1, domain: 'AI', question: 'What is supervised learning?', options: ['A', 'B', 'C', 'D'], correct: 0 },
  { id: 2, domain: 'AI', question: 'What is a neural network?', options: ['A', 'B', 'C', 'D'], correct: 1 },
  { id: 3, domain: 'Full Stack Development', question: 'What is REST?', options: ['A', 'B', 'C', 'D'], correct: 2 },
  // Add more questions as needed...
];

let results = []; // In-memory results (will reset on server restart)

// Validate ID and check test status
app.post('/api/validate-id', (req, res) => {
  const { id } = req.body;
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.json({ success: false, message: 'Invalid ID' });
  }
  if (results.some(r => r.id === id)) {
    return res.json({ success: false, message: 'Test already taken' });
  }
  res.json({ success: true, name: student.name, domain: student.domain });
});

// Fetch random questions
app.post('/api/questions', (req, res) => {
  const { domain } = req.body;
  const domainQuestions = questions.filter(q => q.domain === domain);
  const shuffled = domainQuestions.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 25));
});

// Submit test
app.post('/api/submit', async (req, res) => {
  const { id, answers, cheatingLog } = req.body;
  const student = students.find(s => s.id === id);

  // Evaluate answers
  let correct = 0;
  answers.forEach(ans => {
    const question = questions.find(q => q.id === ans.questionId);
    if (question.correct === ans.selected) correct++;
  });

  // Save result (in-memory)
  const result = { id, name: student.name, domain: student.domain, score: correct, cheatingLog };
  results.push(result);

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'spearheads2022@gmail.com',
      pass: process.env.EMAIL_PASS || 'hqpnmglqjtbuxwpm'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'spearheads2022@gmail.com',
    to: process.env.EMAIL_TO || 'yogeshwarankumaran@gmail.com',
    subject: `Test Result for ${student.name}`,
    text: `ID: ${id}\nName: ${student.name}\nDomain: ${student.domain}\nScore: ${correct}/25\nCheating Attempts: ${JSON.stringify(cheatingLog, null, 2)}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ correct, total: 25, cheatingLog });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email, but test submitted' });
  }
});

module.exports = app; // Export for Vercel serverless