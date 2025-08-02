import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
const API_URL = process.env.REACT_APP_API_URL;
export default function EmailToneImprover() {
  const [emailText, setEmailText] = useState('');
  const [tone, setTone] = useState('formal');
  const [improvedSections, setImprovedSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    if (!emailText.trim()) return;

    setLoading(true);
    setImprovedSections([]);

    try {
      const response = await fetch('${API_URL}/api/improve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText, tone }),
      });

      const data = await response.json();
      console.log("🔹 Frontend API response:", data);

      const text = data.improvedText || "⚠️ AI did not generate any improvement.";
      const sections = text.split('---').map((s) => s.trim()).filter(Boolean);
      setImprovedSections(sections);
    } catch (error) {
      console.error(error);
      setImprovedSections(["❌ Error: Failed to get improved email."]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    // Convert markdown to plain text
    const plainText = text
      .replace(/[#*_>`]/g, '')        // strip markdown characters
      .replace(/\n{2,}/g, '\n\n')     // normalize line breaks
      .trim();

    navigator.clipboard.writeText(plainText);
    alert('✅ Plain text copied to clipboard!');
  };

  return (
    <div>
      {/* Input box */}
      <textarea
        className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
        rows="6"
        placeholder="Type or paste your email here..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />

      {/* Tone buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {['formal', 'friendly', 'concise', 'apologetic'].map((option) => (
          <button
            key={option}
            onClick={() => setTone(option)}
            className={`px-4 py-2 rounded-lg border capitalize transition ${
              tone === option
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Improve button */}
      <button
        onClick={handleImprove}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? 'Improving...' : 'Improve Tone'}
      </button>

      {/* Result cards */}
      {improvedSections.length > 0 && (
        <div className="mt-6 space-y-4">
          {improvedSections.map((section, index) => (
            <div
              key={index}
              className="bg-white border border-green-300 p-6 rounded-lg shadow-md relative"
            >
              <ReactMarkdown
                components={{
                  h3: ({ node, ...props }) => (
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p style={{ marginBottom: '0.75rem', color: '#374151' }} {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      style={{
                        borderLeft: '4px solid #10b981',
                        paddingLeft: '1rem',
                        color: '#4b5563',
                        marginBottom: '0.75rem',
                        fontStyle: 'italic',
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {section}
              </ReactMarkdown>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(section)}
                className="absolute top-3 right-3 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-green-700 text-sm"
              >
                📋 Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
