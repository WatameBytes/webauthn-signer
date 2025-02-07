// src/App.jsx
import React, { useState } from 'react';
import * as webauthnJson from "@github/webauthn-json";

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const handleRegister = async () => {
    try {
      setStatus('Starting WebAuthn registration...');
      setError('');
      
      const data = JSON.parse(jsonInput);
      const parsedOptions = JSON.parse(data.publicKeyCredentialCreationOptionsJson);
      
      setStatus('Creating credentials...');
      const credential = await webauthnJson.create(parsedOptions);
      
      const resultObject = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: credential
      };
      
      const resultString = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: JSON.stringify(credential)
      };
      
      setStatus('Signing completed successfully!');
      const formattedOutput = `# Header format Object version:\n${JSON.stringify(resultObject, null, 2)}\n\n# Header format String version:\n${JSON.stringify(resultString, null, 2)}`;
      setOutput(formattedOutput);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setStatus('');
    }
  };

  const handleAuthenticate = async () => {
    try {
      setStatus('Starting WebAuthn authentication...');
      setError('');
      
      const data = JSON.parse(jsonInput);
      const parsedOptions = JSON.parse(data.assertionRequestJson);
      
      setStatus('Getting credentials...');
      const credential = await webauthnJson.get(parsedOptions);
      
      const resultObject = {
        assertionId: data.assertionId,
        publicKeyCredentialJson: credential
      };
      
      const resultString = {
        assertionId: data.assertionId,
        publicKeyCredentialJson: JSON.stringify(credential)
      };
      
      setStatus('Authentication completed successfully!');
      const formattedOutput = `# Header format Object version:\n${JSON.stringify(resultObject, null, 2)}\n\n# Header format String version:\n${JSON.stringify(resultString, null, 2)}`;
      setOutput(formattedOutput);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setStatus('');
    }
  };

  const getPlaceholder = () => {
    if (activeTab === 'register') {
      return `Example format:
{
  "registrationId": "your-registration-id",
  "publicKeyCredentialCreationOptionsJson": "your-json-string"
}`;
    }
    return `Example format:
{
  "assertionId": "your-assertion-id",
  "assertionRequestJson": "your-json-string"
}`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">WebAuthn Signer</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => {
                setActiveTab('register');
                setJsonInput('');
                setOutput('');
                setError('');
                setStatus('');
              }}
              className={`py-2 px-4 ${
                activeTab === 'register'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setActiveTab('authenticate');
                setJsonInput('');
                setOutput('');
                setError('');
                setStatus('');
              }}
              className={`ml-8 py-2 px-4 ${
                activeTab === 'authenticate'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Authenticate
            </button>
          </nav>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your JSON here
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            placeholder={getPlaceholder()}
          />
        </div>

        <button
          onClick={activeTab === 'register' ? handleRegister : handleAuthenticate}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {activeTab === 'register' ? 'Register with WebAuthn' : 'Authenticate with WebAuthn'}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signed Results
              </label>
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;