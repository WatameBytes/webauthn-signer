import React, { useState } from "react";
import * as webauthnJson from "@github/webauthn-json";

export default function App() {
  // Track which tab is active
  const [currentTab, setCurrentTab] = useState("register");

  // ---------------------------
  //  Registration State
  // ---------------------------
  const [registerJsonInput, setRegisterJsonInput] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerOutput, setRegisterOutput] = useState("");

  // ---------------------------
  //  Authentication State
  // ---------------------------
  const [authJsonInput, setAuthJsonInput] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [authError, setAuthError] = useState("");
  const [authOutput, setAuthOutput] = useState("");

  // ---------------------------
  //  Handlers
  // ---------------------------

  // Registration Handler (calls webauthnJson.create)
  const handleRegister = async () => {
    try {
      setRegisterStatus("Starting WebAuthn registration...");
      setRegisterError("");
      setRegisterOutput("");

      const data = JSON.parse(registerJsonInput);
      // data.registrationId
      // data.publicKeyCredentialCreationOptionsJson

      const parsedOptions = JSON.parse(data.publicKeyCredentialCreationOptionsJson);

      setRegisterStatus("Creating credentials...");

      const credential = await webauthnJson.create(parsedOptions);

      const resultObject = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: credential,
      };

      const resultString = {
        registrationId: data.registrationId,
        publicKeyCredentialJson: JSON.stringify(credential),
      };

      setRegisterStatus("Registration completed successfully!");

      const formattedOutput = `# Header format Object version:\n${JSON.stringify(resultObject, null, 2)}\n\n# Header format String version:\n${JSON.stringify(resultString, null, 2)}`;
      setRegisterOutput(formattedOutput);
    } catch (err) {
      console.error(err);
      setRegisterError(err.message);
      setRegisterStatus("");
    }
  };

  // Authentication Handler (calls webauthnJson.get)
  const handleAuthenticate = async () => {
    try {
      setAuthStatus("Starting WebAuthn authentication...");
      setAuthError("");
      setAuthOutput("");

      const data = JSON.parse(authJsonInput);
      // data.assertionId
      // data.assertionRequestJson

      const parsedOptions = JSON.parse(data.assertionRequestJson);

      setAuthStatus("Requesting credentials...");

      const credential = await webauthnJson.get(parsedOptions);

      const resultObject = {
        assertionId: data.assertionId,
        publicKeyCredentialJson: credential,
      };

      const resultString = {
        assertionId: data.assertionId,
        publicKeyCredentialJson: JSON.stringify(credential),
      };

      setAuthStatus("Assertion completed successfully!");

      const formattedOutput = `# Header format Object version:\n${JSON.stringify(resultObject, null, 2)}\n\n# Header format String version:\n${JSON.stringify(resultString, null, 2)}`;
      setAuthOutput(formattedOutput);
    } catch (err) {
      console.error(err);
      setAuthError(err.message);
      setAuthStatus("");
    }
  };

  // ---------------------------
  //  Render
  // ---------------------------
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        WebAuthn POC: Register &amp; Authenticate
      </h1>

      {/* Tab selectors */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setCurrentTab("register")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "register" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setCurrentTab("authenticate")}
          className={`px-4 py-2 rounded-md ${
            currentTab === "authenticate" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Authenticate
        </button>
      </div>

      {/* Registration Panel */}
      {currentTab === "register" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration JSON
            </label>
            <textarea
              value={registerJsonInput}
              onChange={(e) => setRegisterJsonInput(e.target.value)}
              className="w-full h-64 p-4 border rounded-md font-mono text-sm"
              placeholder={`Example format:
{
  "registrationId": "your-registration-id",
  "publicKeyCredentialCreationOptionsJson": "{...}"
}`}
            />
          </div>
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register (webauthnJson.create)
          </button>

          {registerStatus && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
              {registerStatus}
            </div>
          )}

          {registerError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              Error: {registerError}
            </div>
          )}

          {registerOutput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Results
              </label>
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">
                {registerOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Authentication Panel */}
      {currentTab === "authenticate" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication JSON
            </label>
            <textarea
              value={authJsonInput}
              onChange={(e) => setAuthJsonInput(e.target.value)}
              className="w-full h-64 p-4 border rounded-md font-mono text-sm"
              placeholder={`Example format:
{
  "assertionId": "your-assertion-id",
  "assertionRequestJson": "{...}"
}`}
            />
          </div>
          <button
            onClick={handleAuthenticate}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Authenticate (webauthnJson.get)
          </button>

          {authStatus && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md">
              {authStatus}
            </div>
          )}

          {authError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              Error: {authError}
            </div>
          )}

          {authOutput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication Results
              </label>
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">
                {authOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
