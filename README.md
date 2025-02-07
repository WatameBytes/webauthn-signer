# WebAuthn Signer

A lightweight React application for signing WebAuthn registration options. This tool allows you to paste WebAuthn registration options in JSON format and create credentials using your device's WebAuthn capabilities.

## Features

- Direct JSON input for WebAuthn registration options
- Real-time WebAuthn credential creation
- Clean and simple user interface
- Immediate output display
- Error handling and status updates

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (usually comes with Node.js)
- A WebAuthn-capable device (most modern computers with Windows Hello, Touch ID, or security keys)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/WatameBytes/webauthn-signer.git
```

2. Navigate to the project directory:
```bash
cd webauthn-signer
```

3. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Paste your WebAuthn registration options JSON into the text area. The JSON should have this structure:
```json
{
    "registrationId": "your-registration-id",
    "publicKeyCredentialCreationOptions": "your-options-json-string"
}
```

2. Click the "Sign with WebAuthn" button

3. Follow your device's authentication prompts (e.g., Windows Hello, Touch ID)

4. The signed result will appear below the input area

## Development

The project uses:
- Vite for build tooling
- React for the UI
- @github/webauthn-json for WebAuthn operations
- Tailwind CSS for styling

To modify the port or other configurations, edit `vite.config.js`.

## Troubleshooting

Common issues:

1. **Invalid JSON Format**: Ensure your input JSON is properly formatted and includes both `registrationId` and `publicKeyCredentialCreationOptions`

2. **WebAuthn Not Available**: Make sure you're:
   - Using a secure context (HTTPS or localhost)
   - Using a supported browser (most modern browsers support WebAuthn)
   - Have a WebAuthn-capable authenticator (Windows Hello, Touch ID, security key)

3. **Port Conflicts**: If port 3000 is in use, edit `vite.config.js` to use a different port

## Contributing

Feel free to submit issues and enhancement requests!

## License

[MIT License](LICENSE)
