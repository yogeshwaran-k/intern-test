import { useState } from 'react';

function IdEntry({ setStage, setStudent, setQuestions, showModal, closeModal }) {
  const [id, setId] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Use env variable

  const handleSubmit = async () => {
    const res = await fetch(`${API_BASE_URL}/api/validate-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (!data.success) {
      showModal('Error', data.message);
      return;
    }
   showModal(
    'Confirm Identity',
  `Is this you? ${data.name}\nOpted for ${data.domain}`,
      true,
      async () => {
        try {
          setStudent({ id, name: data.name, domain: data.domain });
          const qRes = await fetch(`${API_BASE_URL}/api/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: data.domain })
          });
          if (!qRes.ok) throw new Error('Failed to fetch questions');
          setQuestions(await qRes.json());
          setStage('test');
          closeModal();
        } catch (err) {
          showModal('Error', 'Failed to load test. Please try again.');
        }
      }
    );
  };

  return (
    <>
      <header>
        <h1>SpearHeads Intern Test</h1>
      </header>
      <div className="container">
        <div className="card mt-5">
          <h2 className="text-center mb-4">Enter Your ID</h2>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-person"></i></span>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter ID"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <footer>
        <p> Made with ❤️ by <a href="https://yogeshwaran-kumaran.netlify.app/">Yogeshwaran Kumaran</a></p>
      </footer>
    </>
  );
}

export default IdEntry;
