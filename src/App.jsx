// src/App.jsx
import React, { useState } from 'react';
import * as webauthnJson from "@github/webauthn-json";

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const handleSign = async () => {
    try {
      setStatus('Starting WebAuthn process...');
      setError('');
      
      // Parse the input JSON
      const data = JSON.parse(jsonInput);
      
      // Parse the nested JSON string into an object
      const parsedOptions = JSON.parse(data.publicKeyCredentialCreationOptions);
      
      setStatus('Creating credentials...');
      
      // Create the credential using the library
      const credential = await webauthnJson.create(parsedOptions);
      
      // Create the final result
      const result = {
        registrationId: data.registrationId,
        credential: credential
      };
      
      setStatus('Signing completed successfully!');
      setOutput(JSON.stringify(result, null, 2));
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setStatus('');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">WebAuthn Signer</h1>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your JSON here
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            placeholder="Paste your JSON response here..."
          />
        </div>

        <button
          onClick={handleSign}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign with WebAuthn
        </button>

        {status && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
            {status}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signed Result
            </label>
            <pre className="p-4 bg-gray-50 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;