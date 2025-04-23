const express = require('express');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Load JSON files
const loadData = async (file) => JSON.parse(await fs.readFile(`./server/${file}.json`));
const saveData = async (file, data) => await fs.writeFile(`./server/${file}.json`, JSON.stringify(data, null, 2));

// Validate ID and check test status
app.post('/api/validate-id', async (req, res) => {
  const { id } = req.body;
  const students = await loadData('students');
  const results = await loadData('results');
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
app.post('/api/questions', async (req, res) => {
  const { domain } = req.body;
  const questions = await loadData('questions');
  const domainQuestions = questions.filter(q => q.domain === domain);
  const shuffled = domainQuestions.sort(() => 0.5 - Math.random());
  res.json(shuffled.slice(0, 25));
});

// Submit test
app.post('/api/submit', async (req, res) => {
  const { id, answers, cheatingLog } = req.body;
  const students = await loadData('students');
  const questions = await loadData('questions');
  const results = await loadData('results');
  const student = students.find(s => s.id === id);

  // Evaluate answers
  let correct = 0;
  answers.forEach(ans => {
    const question = questions.find(q => q.id === ans.questionId);
    if (question.correct === ans.selected) correct++;
  });

  // Save result
  const result = { id, name: student.name, domain: student.domain, score: correct, cheatingLog };
  results.push(result);
  await saveData('results', results);

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'spearheads2022@gmail.com', // Replace with your Gmail
      pass: 'hqpnmglqjtbuxwpm'     // Replace with Gmail App Password
    }
  });

  const mailOptions = {
    from: 'spearheads2022@gmail.com',
    to: 'yogeshwarankumaran@gmail.com', // Replace with your email
    subject: `Test Result for ${student.name}`,
    text: `ID: ${id}\nName: ${student.name}\nDomain: ${student.domain}\nScore: ${correct}/25\nCheating Attempts: ${JSON.stringify(cheatingLog, null, 2)}`
  };

  await transporter.sendMail(mailOptions);

  res.json({ correct, total: 25, cheatingLog });
});

app.listen(5000, () => console.log('Server running on port 5000'));