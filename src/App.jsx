import React, { useState } from 'react';
import * as webauthnJson from "@github/webauthn-json";

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const [selectedRpId, setSelectedRpId] = useState('localhost');

  const handleSign = async () => {
    try {
      setStatus('Starting WebAuthn process...');
      setError('');
      
      // Parse the input JSON
      const data = JSON.parse(jsonInput);
      
      // Parse the publicKeyCredentialCreationOptions and modify rpId
      const parsedOptions = JSON.parse(data.publicKeyCredentialCreationOptionsJson);
      
      // Update the rpId
      if (parsedOptions.publicKey && parsedOptions.publicKey.rp) {
        parsedOptions.publicKey.rp.id = selectedRpId;
      }
      
      setStatus('Creating credentials with rpId: ' + selectedRpId);
      
      // Create the credential using the library
      const credential = await webauthnJson.create(parsedOptions);
      
      // Create both result formats
      const resultObject = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: credential
      };

      const resultString = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: JSON.stringify(credential)
      };
      
      setStatus('Signing completed successfully!');
      
      // Create formatted output string with custom headers
      const formattedOutput = `# Header format Object version:\n${JSON.stringify(resultObject, null, 2)}\n\n# Header format String version:\n${JSON.stringify(resultString, null, 2)}`;
      setOutput(formattedOutput);
      
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
            Select Relying Party ID
          </label>
          <select
            value={selectedRpId}
            onChange={(e) => setSelectedRpId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="localhost">localhost</option>
            <option value="webauthn-signer.vercel.app">webauthn-signer.vercel.app</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your JSON here
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            placeholder={`Example format:
{
  "registrationId": "your-registration-id",
  "publicKeyCredentialCreationOptions": "your-json-string"
}`}
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
