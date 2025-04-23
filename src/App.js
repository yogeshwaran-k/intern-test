import { useState } from 'react';
import IdEntry from './components/IdEntry';
import TestPage from './components/TestPage';
import ResultPage from './components/ResultPage';
import CustomModal from './components/Modal';

function App() {
  const [stage, setStage] = useState('idEntry');
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', confirmButton: false, onConfirm: null });

  const showModal = (title, message, confirmButton = false, onConfirm = null) => {
    setModal({ show: true, title, message, confirmButton, onConfirm });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <div className="container">
      {stage === 'idEntry' && (
        <IdEntry
          setStage={setStage}
          setStudent={setStudent}
          setQuestions={setQuestions}
          showModal={showModal}
          closeModal={closeModal} // Pass closeModal
        />
      )}
      {stage === 'test' && (
        <TestPage
          student={student}
          questions={questions}
          setStage={setStage}
          setResults={setResults}
          showModal={showModal}
        />
      )}
      {stage === 'results' && <ResultPage results={results} />}
      <CustomModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        confirmButton={modal.confirmButton}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}

export default App;