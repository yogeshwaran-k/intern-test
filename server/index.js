const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory data (replace JSON files)
const students = [
  { id:'SH202511OCTIN01', name:'S Nikitha Sri', domain: 'Artificial Intelligence' },
  { id:'SH202511OCTIN02', name:'S Raghavi', domain: 'Computer Networking' },
  { id:'SH202511OCTIN03', name:'R Rajarajesvari', domain: 'Python & Java' },
  { id:'SH202511OCTIN04', name:'M S Sahana', domain: 'Full Stack Development' },
  { id:'SH202511OCTIN05', name:'S Sujitha', domain: 'Database Management' },
  { id:'SH202511OCTIN06', name:'A Varsha', domain: 'Database Management' },
  { id:'SH202511OCTIN07', name:'B Dharsith', domain: 'Python & Java' },
  { id:'SH202511OCTIN08', name:'yk', domain: 'Python & Java' },
  { id:'SH202511OCTIN09', name:'YOYO', domain: 'Computer Networking' }
];


const questions =[
  { id: 1, domain: 'Artificial Intelligence', question: 'What is supervised learning?', options: ['Unlabeled data', 'Labeled data', 'Random data', 'Structured data'], correct: 1 },
  { id: 2, domain: 'Artificial Intelligence', question: 'What is a neural network?', options: ['A storage device', 'A machine learning model', 'A type of CPU', 'A search algorithm'], correct: 1 },
  { id: 3, domain: 'Artificial Intelligence', question: 'Which algorithm is used for classification?', options: ['K-means', 'K-NN', 'DFS', 'PageRank'], correct: 1 },
  { id: 4, domain: 'Artificial Intelligence', question: 'Which language is most used in AI?', options: ['C', 'Python', 'JavaScript', 'HTML'], correct: 1 },
  { id: 5, domain: 'Artificial Intelligence', question: 'What is reinforcement learning?', options: ['Learning from examples', 'Learning by reward', 'Learning by clustering', 'Learning by labels'], correct: 1 },
  { id: 6, domain: 'Artificial Intelligence', question: 'Which is NOT an AI application?', options: ['Image recognition', 'Speech recognition', 'Text editor', 'Autonomous vehicles'], correct: 2 },
  { id: 7, domain: 'Artificial Intelligence', question: 'What is overfitting?', options: ['Good performance', 'Model learns noise', 'Low bias', 'High speed'], correct: 1 },
  { id: 8, domain: 'Artificial Intelligence', question: 'Which is a search algorithm in AI?', options: ['DFS', 'LR', 'CNN', 'SVM'], correct: 0 },
  { id: 9, domain: 'Artificial Intelligence', question: 'Which is a type of neural network?', options: ['Naive Bayes', 'Decision Tree', 'CNN', 'Random Forest'], correct: 2 },
  { id: 10, domain: 'Artificial Intelligence', question: 'What does NLP stand for?', options: ['Natural Learning Process', 'Natural Language Processing', 'New Logic Protocol', 'Neural Language Procedure'], correct: 1 },
  { id: 11, domain: 'Artificial Intelligence', question: 'What is a decision tree?', options: ['A type of hardware', 'A flowchart-like tree', 'A neuron', 'A clustering tool'], correct: 1 },
  { id: 12, domain: 'Artificial Intelligence', question: 'Which of these is NOT a supervised algorithm?', options: ['Linear Regression', 'SVM', 'K-means', 'Decision Tree'], correct: 2 },
  { id: 13, domain: 'Artificial Intelligence', question: 'Which AI term refers to the ability to mimic human thought?', options: ['Automation', 'Machine Learning', 'Cognitive Computing', 'Virtualization'], correct: 2 },
  { id: 14, domain: 'Artificial Intelligence', question: 'Which concept involves agents acting in an environment?', options: ['Clustering', 'Reinforcement Learning', 'Backpropagation', 'Classification'], correct: 1 },
  { id: 15, domain: 'Artificial Intelligence', question: 'What is the purpose of training data?', options: ['To test the model', 'To make predictions', 'To learn patterns', 'To increase accuracy'], correct: 2 },
  { id: 16, domain: 'Artificial Intelligence', question: 'Which of these is a common evaluation metric for classification?', options: ['MSE', 'Accuracy', 'RMSE', 'MAE'], correct: 1 },
  { id: 17, domain: 'Artificial Intelligence', question: 'Which of the following is NOT a deep learning framework?', options: ['TensorFlow', 'PyTorch', 'NumPy', 'Keras'], correct: 2 },
  { id: 18, domain: 'Artificial Intelligence', question: 'Which function is used to activate neurons?', options: ['sigmoid()', 'input()', 'relu()', 'Both sigmoid and relu'], correct: 3 },
  { id: 19, domain: 'Artificial Intelligence', question: 'Which data type is best for image input?', options: ['CSV', 'Array', 'Text', 'Pixels'], correct: 3 },
  { id: 20, domain: 'Artificial Intelligence', question: 'Which of the following uses a reward system?', options: ['Supervised', 'Reinforcement', 'Unsupervised', 'None'], correct: 1 },
  { id: 21, domain: 'Artificial Intelligence', question: 'Which is an ensemble technique?', options: ['Bagging', 'Gradient Descent', 'Activation', 'Regression'], correct: 0 },
  { id: 22, domain: 'Artificial Intelligence', question: 'Which term describes converting raw data into features?', options: ['Evaluation', 'Preprocessing', 'Prediction', 'Inference'], correct: 1 },
  { id: 23, domain: 'Artificial Intelligence', question: 'Which model is used for sequential data?', options: ['SVM', 'RNN', 'KNN', 'K-means'], correct: 1 },
  { id: 24, domain: 'Artificial Intelligence', question: 'Which AI model is best for language translation?', options: ['CNN', 'RNN', 'Transformer', 'LSTM'], correct: 2 },
  { id: 25, domain: 'Artificial Intelligence', question: 'Which is a type of unsupervised learning?', options: ['Regression', 'Classification', 'Clustering', 'Linear prediction'], correct: 2 },
  { id: 26, domain: 'Full Stack Development', question: 'What does REST stand for?', options: ['Random Execution', 'Representational State Transfer', 'Request Evaluation', 'Remote Execution'], correct: 1 },
  { id: 27, domain: 'Full Stack Development', question: 'What is the role of the backend?', options: ['Styling', 'Logic & Database', 'Layout', 'Animations'], correct: 1 },
  { id: 28, domain: 'Full Stack Development', question: 'Which is a frontend framework?', options: ['Django', 'Express', 'React', 'Node.js'], correct: 2 },
  { id: 29, domain: 'Full Stack Development', question: 'What is Node.js used for?', options: ['Frontend design', 'Server-side logic', 'Image editing', 'Data analysis'], correct: 1 },
  { id: 30, domain: 'Full Stack Development', question: 'Which database is NoSQL?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], correct: 2 },
  { id: 31, domain: 'Full Stack Development', question: 'Which HTML tag is used for a link?', options: ['<div>', '<link>', '<a>', '<p>'], correct: 2 },
  { id: 32, domain: 'Full Stack Development', question: 'Which HTTP method is used to retrieve data?', options: ['POST', 'GET', 'PUT', 'DELETE'], correct: 1 },
  { id: 33, domain: 'Full Stack Development', question: 'Which CSS property changes text color?', options: ['background', 'font', 'color', 'text-style'], correct: 2 },
  { id: 34, domain: 'Full Stack Development', question: 'Which of these is a backend language?', options: ['HTML', 'JavaScript', 'Python', 'CSS'], correct: 2 },
  { id: 35, domain: 'Full Stack Development', question: 'What does MVC stand for?', options: ['Model View Controller', 'Main View Class', 'Middleware View Code', 'Model View Code'], correct: 0 },
  { id: 36, domain: 'Full Stack Development', question: 'Which one is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Float', 'Undefined'], correct: 2 },
  { id: 37, domain: 'Full Stack Development', question: 'Which tool is used for version control?', options: ['Postman', 'Git', 'Docker', 'npm'], correct: 1 },
  { id: 38, domain: 'Full Stack Development', question: 'What does the "flex" CSS property do?', options: ['Adds padding', 'Aligns items', 'Changes text', 'Adds a border'], correct: 1 },
  { id: 39, domain: 'Full Stack Development', question: 'Which of these is a Node.js framework?', options: ['Flask', 'Laravel', 'Express.js', 'Rails'], correct: 2 },
  { id: 40, domain: 'Full Stack Development', question: 'What is the purpose of JSON?', options: ['Styling', 'Database management', 'Data exchange', 'Error handling'], correct: 2 },
  { id: 41, domain: 'Full Stack Development', question: 'Which command initializes a Git repo?', options: ['git start', 'git init', 'git run', 'git create'], correct: 1 },
  { id: 42, domain: 'Full Stack Development', question: 'Which status code means "Not Found"?', options: ['200', '301', '404', '500'], correct: 2 },
  { id: 43, domain: 'Full Stack Development', question: 'Which is used to send HTTP requests for testing APIs?', options: ['VS Code', 'GitHub', 'Postman', 'Docker'], correct: 2 },
  { id: 44, domain: 'Full Stack Development', question: 'What does "npm" stand for?', options: ['Node Protocol Manager', 'Node Package Manager', 'Network Process Manager', 'Node Performance Module'], correct: 1 },
  { id: 45, domain: 'Full Stack Development', question: 'Which HTML tag is used for a form?', options: ['<div>', '<input>', '<form>', '<span>'], correct: 2 },
  { id: 46, domain: 'Full Stack Development', question: 'Which SQL operation reads data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correct: 2 },
  { id: 47, domain: 'Full Stack Development', question: 'Which CSS selector targets a class?', options: ['#class', '.class', '/class', '?class'], correct: 1 },
  { id: 48, domain: 'Full Stack Development', question: 'What does the "href" attribute define?', options: ['Image path', 'Text color', 'Link destination', 'Font size'], correct: 2 },
  { id: 49, domain: 'Full Stack Development', question: 'What is the use of MongoDB?', options: ['Relational DB', 'Document-oriented DB', 'File storage', 'Web server'], correct: 1 },
  { id: 50, domain: 'Full Stack Development', question: 'Which HTTP method is used to update data?', options: ['GET', 'POST', 'PUT', 'HEAD'], correct: 2 },
  { id: 51, domain: 'Computer Networking', question: 'What does IP stand for?', options: ['Internet Process', 'Internal Protocol', 'Internet Protocol', 'Information Path'], correct: 2 },
  { id: 52, domain: 'Computer Networking', question: 'What is the main function of a router?', options: ['Stores data', 'Transfers power', 'Routes data packets', 'Blocks ads'], correct: 2 },
  { id: 53, domain: 'Computer Networking', question: 'Which layer does TCP belong to?', options: ['Application', 'Transport', 'Network', 'Physical'], correct: 1 },
  { id: 54, domain: 'Computer Networking', question: 'What is the port number for HTTP?', options: ['20', '22', '80', '110'], correct: 2 },
  { id: 55, domain: 'Computer Networking', question: 'What is a MAC address?', options: ['Memory ID', 'Media Access Control', 'Main Address Controller', 'Modem Allocation Code'], correct: 1 },
  { id: 56, domain: 'Computer Networking', question: 'Which protocol is used to send emails?', options: ['HTTP', 'FTP', 'SMTP', 'DNS'], correct: 2 },
  { id: 57, domain: 'Computer Networking', question: 'Which of these is a private IP range?', options: ['192.168.0.1', '8.8.8.8', '172.217.3.110', '1.1.1.1'], correct: 0 },
  { id: 58, domain: 'Computer Networking', question: 'What does DNS do?', options: ['Assigns IPs', 'Sends messages', 'Resolves domain names', 'Stores files'], correct: 2 },
  { id: 59, domain: 'Computer Networking', question: 'Which device connects multiple networks?', options: ['Switch', 'Hub', 'Router', 'Repeater'], correct: 2 },
  { id: 60, domain: 'Computer Networking', question: 'What does LAN stand for?', options: ['Large Area Network', 'Local Area Network', 'Light Access Node', 'Local Access Network'], correct: 1 },
  { id: 61, domain: 'Computer Networking', question: 'Which of these is NOT a valid IP address?', options: ['192.168.1.1', '256.0.0.1', '10.0.0.1', '172.16.0.1'], correct: 1 },
  { id: 62, domain: 'Computer Networking', question: 'What is a firewall used for?', options: ['Heat detection', 'Virus scanning', 'Security filter', 'Data recovery'], correct: 2 },
  { id: 63, domain: 'Computer Networking', question: 'Which protocol secures websites?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], correct: 1 },
  { id: 64, domain: 'Computer Networking', question: 'Which layer is responsible for encryption?', options: ['Data Link', 'Application', 'Session', 'Presentation'], correct: 3 },
  { id: 65, domain: 'Computer Networking', question: 'What is the maximum length of an IPv4 address?', options: ['16 bits', '32 bits', '64 bits', '128 bits'], correct: 1 },
  { id: 66, domain: 'Computer Networking', question: 'What is ping used for?', options: ['Transfer files', 'Test network reachability', 'Secure data', 'Compress packets'], correct: 1 },
  { id: 67, domain: 'Computer Networking', question: 'What is an example of a top-level domain?', options: ['com', 'google', 'www', 'http'], correct: 0 },
  { id: 68, domain: 'Computer Networking', question: 'Which layer establishes a logical link between hosts?', options: ['Session', 'Network', 'Transport', 'Data Link'], correct: 0 },
  { id: 69, domain: 'Computer Networking', question: 'Which protocol transfers files over the internet?', options: ['DNS', 'FTP', 'SMTP', 'SSH'], correct: 1 },
  { id: 70, domain: 'Computer Networking', question: 'What is NAT used for?', options: ['Email filtering', 'IP address translation', 'Speed boosting', 'Firewall replacement'], correct: 1 },
  { id: 71, domain: 'Computer Networking', question: 'Which layer packages data into frames?', options: ['Application', 'Session', 'Data Link', 'Physical'], correct: 2 },
  { id: 72, domain: 'Computer Networking', question: 'What is a subnet mask used for?', options: ['Security', 'Routing', 'Network segmentation', 'Speed increase'], correct: 2 },
  { id: 73, domain: 'Computer Networking', question: 'What does URL stand for?', options: ['Uniform Routing List', 'Universal Resource Locator', 'Uniform Resource Locator', 'User Resource Log'], correct: 2 },
  { id: 74, domain: 'Computer Networking', question: 'Which device amplifies signals?', options: ['Repeater', 'Router', 'Hub', 'Switch'], correct: 0 },
  { id: 75, domain: 'Computer Networking', question: 'Which layer is closest to the user?', options: ['Application', 'Network', 'Transport', 'Physical'], correct: 0 },
  { id: 76, domain: 'Database Management', question: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'System Query Language', 'Sequential Query Language'], correct: 1 },
  { id: 77, domain: 'Database Management', question: 'Which SQL keyword is used to retrieve data?', options: ['GET', 'PULL', 'SELECT', 'FETCH'], correct: 2 },
  { id: 78, domain: 'Database Management', question: 'Which of the following is a primary key?', options: ['A unique identifier', 'A foreign key', 'A table name', 'A column name'], correct: 0 },
  { id: 79, domain: 'Database Management', question: 'Which SQL clause is used for filtering rows?', options: ['WHERE', 'FILTER', 'ORDER BY', 'GROUP BY'], correct: 0 },
  { id: 80, domain: 'Database Management', question: 'What is a foreign key?', options: ['Key in another table', 'A duplicate key', 'A temporary key', 'Primary key of same table'], correct: 0 },
  { id: 81, domain: 'Database Management', question: 'Which command is used to insert data?', options: ['ADD', 'INSERT INTO', 'PUT', 'INCLUDE'], correct: 1 },
  { id: 82, domain: 'Database Management', question: 'What does normalization do?', options: ['Creates duplicates', 'Reduces redundancy', 'Increases speed', 'Joins tables'], correct: 1 },
  { id: 83, domain: 'Database Management', question: 'Which is a DDL command?', options: ['SELECT', 'INSERT', 'DELETE', 'CREATE'], correct: 3 },
  { id: 84, domain: 'Database Management', question: 'What is a relational database?', options: ['A spreadsheet', 'A graph-based system', 'Data organized in tables', 'Flat file storage'], correct: 2 },
  { id: 85, domain: 'Database Management', question: 'What does the COUNT() function do?', options: ['Counts rows', 'Sums values', 'Counts tables', 'Shows max value'], correct: 0 },
  { id: 86, domain: 'Database Management', question: 'Which SQL command removes a table?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correct: 1 },
  { id: 87, domain: 'Database Management', question: 'Which one is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], correct: 2 },
  { id: 88, domain: 'Database Management', question: 'Which clause is used to sort data?', options: ['WHERE', 'SORT', 'ORDER BY', 'GROUP'], correct: 2 },
  { id: 89, domain: 'Database Management', question: 'What does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Create, Insert, Delete', 'Active Control In Database', 'All Current Input Data'], correct: 0 },
  { id: 90, domain: 'Database Management', question: 'Which SQL keyword is used to rename a column?', options: ['CHANGE', 'MODIFY', 'RENAME TO', 'AS'], correct: 3 },
  { id: 91, domain: 'Database Management', question: 'Which type of join returns all rows when there is a match in either table?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3 },
  { id: 92, domain: 'Database Management', question: 'What does the GROUP BY clause do?', options: ['Deletes rows', 'Filters columns', 'Aggregates data', 'Sorts alphabetically'], correct: 2 },
  { id: 93, domain: 'Database Management', question: 'Which index speeds up data retrieval?', options: ['Foreign key', 'Hash index', 'Primary key', 'Secondary index'], correct: 1 },
  { id: 94, domain: 'Database Management', question: 'Which SQL statement changes table data?', options: ['UPDATE', 'MODIFY', 'CHANGE', 'EDIT'], correct: 0 },
  { id: 95, domain: 'Database Management', question: 'Which function gives average value in SQL?', options: ['MEAN()', 'AVERAGE()', 'AVG()', 'SUM()'], correct: 2 },
  { id: 96, domain: 'Database Management', question: 'What is a view in SQL?', options: ['Temporary table', 'Permanent backup', 'Virtual table', 'Duplicate row'], correct: 2 },
  { id: 97, domain: 'Database Management', question: 'Which clause is used to limit rows?', options: ['LIMIT', 'RESTRICT', 'MAX', 'STOP'], correct: 0 },
  { id: 98, domain: 'Database Management', question: 'Which of these is used to delete all rows but keep table structure?', options: ['DROP', 'DELETE', 'REMOVE', 'TRUNCATE'], correct: 3 },
  { id: 99, domain: 'Database Management', question: 'What does the DISTINCT keyword do?', options: ['Filters duplicates', 'Deletes records', 'Sorts rows', 'Limits rows'], correct: 0 },
  { id: 100, domain: 'Database Management', question: 'Which type of constraint ensures uniqueness?', options: ['NOT NULL', 'UNIQUE', 'DEFAULT', 'CHECK'], correct: 1 },
  { id: 101, domain: 'Python & Java', question: 'Which keyword is used to define a function in Python?', options: ['func', 'define', 'def', 'function'], correct: 2 },
  { id: 102, domain: 'Python & Java', question: 'What is the extension for a Python file?', options: ['.java', '.py', '.pt', '.txt'], correct: 1 },
  { id: 103, domain: 'Python & Java', question: 'Which method is used to print output in Java?', options: ['echo()', 'print()', 'console()', 'System.out.println()'], correct: 3 },
  { id: 104, domain: 'Python & Java', question: 'Which symbol is used for comments in Python?', options: ['//', '#', '/* */', '--'], correct: 1 },
  { id: 105, domain: 'Python & Java', question: 'What is the entry point of a Java program?', options: ['start()', 'main()', 'run()', 'init()'], correct: 1 },
  { id: 106, domain: 'Python & Java', question: 'Which of the following is a mutable data type in Python?', options: ['tuple', 'list', 'str', 'int'], correct: 1 },
  { id: 107, domain: 'Python & Java', question: 'Which loop is not available in Python?', options: ['while', 'for', 'do-while', 'foreach'], correct: 2 },
  { id: 108, domain: 'Python & Java', question: 'How do you start a class definition in Java?', options: ['class:', 'define class', 'class', 'class ClassName {'], correct: 3 },
  { id: 109, domain: 'Python & Java', question: 'Which collection type doesn’t allow duplicates in Java?', options: ['List', 'Set', 'ArrayList', 'LinkedList'], correct: 1 },
  { id: 110, domain: 'Python & Java', question: 'Which of these is not a valid Python data type?', options: ['int', 'float', 'decimal', 'char'], correct: 3 },
  { id: 111, domain: 'Python & Java', question: 'What does JVM stand for?', options: ['Java Virtual Method', 'Java Variable Manager', 'Java Virtual Machine', 'Java Visual Model'], correct: 2 },
  { id: 112, domain: 'Python & Java', question: 'Which keyword is used for inheritance in Python?', options: ['inherits', 'extends', 'super', 'class'], correct: 3 },
  { id: 113, domain: 'Python & Java', question: 'Which function is used to get user input in Python?', options: ['scan()', 'input()', 'get()', 'read()'], correct: 1 },
  { id: 114, domain: 'Python & Java', question: 'Which loop structure exists in Java but not in Python?', options: ['for', 'while', 'do-while', 'loop'], correct: 2 },
  { id: 115, domain: 'Python & Java', question: 'Which keyword is used to create an object in Java?', options: ['class', 'this', 'new', 'object'], correct: 2 },
  { id: 116, domain: 'Python & Java', question: 'Which of these is used for exception handling in Python?', options: ['try-except', 'catch', 'throw', 'finally-catch'], correct: 0 },
  { id: 117, domain: 'Python & Java', question: 'What is the default return type of Python functions?', options: ['int', 'void', 'None', 'float'], correct: 2 },
  { id: 118, domain: 'Python & Java', question: 'Which collection in Java is ordered and allows duplicates?', options: ['HashSet', 'TreeSet', 'List', 'Map'], correct: 2 },
  { id: 119, domain: 'Python & Java', question: 'Which of these is used to define a constant in Java?', options: ['const', 'define', 'static final', 'constant'], correct: 2 },
  { id: 120, domain: 'Python & Java', question: 'How do you create a dictionary in Python?', options: ['()', '[]', '{}', '<>'], correct: 2 },
  { id: 121, domain: 'Python & Java', question: 'Which Python module is used for math operations?', options: ['numbers', 'calculate', 'math', 'random'], correct: 2 },
  { id: 122, domain: 'Python & Java', question: 'What is the superclass of all classes in Java?', options: ['Object', 'Base', 'Parent', 'Main'], correct: 0 },
  { id: 123, domain: 'Python & Java', question: 'Which keyword is used to stop a loop in Python?', options: ['exit', 'break', 'return', 'stop'], correct: 1 },
  { id: 124, domain: 'Python & Java', question: 'What is indentation used for in Python?', options: ['To improve readability', 'To separate files', 'To declare variables', 'To define blocks of code'], correct: 3 },
  { id: 125, domain: 'Python & Java', question: 'Which keyword is used to inherit a class in Java?', options: ['super', 'inherits', 'extends', 'from'], correct: 2 }
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
