import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ResultPage({ results }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [
          {
            label: 'Answers',
            data: [results.correct, results.total - results.correct],
            backgroundColor: ['#28a745', '#dc3545']
          }
        ]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [results]);

  return (
    <>
      <header>
        <h1>SpearHeads Intern Test Results</h1>
      </header>
      <div className="container">
        <div className="card mt-5">
          <h2 className="text-center mb-4">Test Results</h2>
          <p className="text-center">
            <strong>Score: {results.correct}/{results.total}</strong>
          </p>
          <div className="chart-container">
            <canvas ref={chartRef} />
          </div>
          {results.cheatingLog.length > 0 && (
            <div>
              <h4>Cheating Attempts</h4>
              <ul className="list-group">
                {results.cheatingLog.map((log, idx) => (
                  <li key={idx} className="list-group-item">
                    {log.action.replace('_attempt', '')} at {new Date(log.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Back to Home
          </button>
        </div>
      </div>
      <footer>
      <p> Made with ❤️ by <a href="https://yogeshwaran-kumaran.netlify.app/">Yogeshwaran Kumaran</a></p>
      </footer>
    </>
  );
}

export default ResultPage;