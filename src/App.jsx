import { useState } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null);
    setError(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      // Accept both string and object results
      if (typeof data === 'object' && data !== null && !data.description) {
        setResult(data);
      } else if (data.description) {
        setResult({ Description: data.description });
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('No result found.');
      }
    } catch (err) {
      setError('Error analyzing image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Image Analyser</h1>
      {preview && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, boxShadow: '0 2px 8px #aaa' }} />
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading || !image} style={{ padding: '8px 16px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Analyzing...' : 'Pick an image'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Card Details</h2>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(result).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 'bold', padding: 4, borderBottom: '1px solid #ddd', width: '35%' }}>{key}</td>
                    <td style={{ padding: 4, borderBottom: '1px solid #ddd' }}>{value === null ? <span style={{ color: '#888' }}>N/A</span> : value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red', marginTop: 16 }}>{error}</p>}
    </div>
  );
}

export default App
