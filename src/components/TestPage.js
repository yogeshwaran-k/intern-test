  import { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

function TestPage({ student, questions, setStage, setResults, showModal }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [answers, setAnswers] = useState({});
  const [cheatingLog, setCheatingLog] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit(); // Submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const logCheating = (action) => {
      setCheatingLog((log) => [
        ...log,
        { action, timestamp: new Date().toISOString() }
      ]);
      showModal('Warning', `Action not allowed: ${action.replace('_attempt', '')}`);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logCheating('tab_switch_attempt');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      logCheating('right_click_attempt');
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      logCheating(`${e.type}_attempt`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [showModal, handleSubmit]); // Include handleSubmit as a dependency

  const handleAnswer = (questionId, selected) => {
    setAnswers({ ...answers, [questionId]: selected });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map((qId) => ({
      questionId: parseInt(qId),
      selected: answers[qId]
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student.id,
          answers: formattedAnswers,
          cheatingLog
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      setResults(await res.json());
      setStage('results');
    } catch (err) {
      showModal('Error', 'Failed to submit test. Please try again.');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="card mt-5">
      <h2 className="text-center mb-4">{student.domain} Test</h2>
      <div className="d-flex justify-content-between mb-3">
        <p>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        <p>Questions Answered: {answeredCount}/{questions.length}</p>
      </div>
      <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
      {questions.map((q, idx) => (
        <div key={q.id} className="question">
          <p>
            <strong>{idx + 1}.</strong> {q.question}
          </p>
          {q.options.map((opt, i) => (
            <div key={i} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`q${q.id}`}
                value={i}
                onChange={() => handleAnswer(q.id, i)}
                id={`q${q.id}-${i}`}
              />
              <label className="form-check-label" htmlFor={`q${q.id}-${i}`}>
                {opt}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Test
      </button>
    </div>
  );
}

export default TestPage;
