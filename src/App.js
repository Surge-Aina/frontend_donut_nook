import React, { useEffect, useState } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [mongoMessage, setMongoMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ping`)
      .then(res => res.json())
      .then(data => {
        setBackendMessage(data.message);
        setMongoMessage(data.dbTest);
      })
      .then(data => {
        console.log(data);
      })
      .catch(() => {
        setBackendMessage('❌ Could not reach backend.');
        setMongoMessage('❌ MongoDB may also be unreachable.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🚀 Donut Nook – Deployment Test</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>✅ Backend Status:</h2>
          <p>{backendMessage}</p>

          <h2>✅ MongoDB Test Result:</h2>
          <p>{mongoMessage}</p>
        </>
      )}
    </div>
  );
}

export default App;
