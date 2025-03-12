'use client'

import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const CLIENT_ID = '855ec8198b9c462d';
  const REDIRECT_URI = 'http://localhost:3000/callback';
  const STATE = '1';
  
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Listen for messages from the popup window
    const handleMessage = (event: MessageEvent) => {
      // Make sure the message is from our popup
      if (event.data && event.data.type === 'OAUTH_CALLBACK') {
        if (event.data.error) {
          setError(event.data.error);
          setMessage('Authentication failed. Please try again.');
          console.error('OAuth error:', event.data.error);
        } else {
          setAuthCode(event.data.code);
          setMessage('Authentication successful!');
          setError(null);
          
          // In a real application, you would send this code to your backend
          // to exchange it for an access token
          console.log('Received auth code:', event.data.code);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  const handleOAuthLogin = () => {
    const authUrl = `https://dashboard.convex.dev/oauth/authorize/project?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${STATE}`;
    
    // Reset state when starting a new login flow
    setAuthCode(null);
    setMessage(null);
    setError(null);
    
    // Open the authorization URL in a popup window
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    window.open(
      authUrl,
      'oauth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    console.log("Opening OAuth flow:", authUrl);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-4xl font-bold">OAuth Example</h1>
        
        <div className="flex flex-col items-center gap-8">
          <p className="text-center max-w-md">
            Click the button below to start the OAuth flow with Convex.
            You will be redirected to Convex's authentication page in a popup.
          </p>
          
          <button
            onClick={handleOAuthLogin}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-base h-12 px-6"
          >
            Login with Convex
          </button>
          
          {message && !error && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Authentication failed: {error}
            </div>
          )}
          
          {authCode && (
            <div className="w-full max-w-lg">
              <p className="font-semibold mb-2">Authorization Code:</p>
              <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm">
                {authCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                In a real application, this code would be sent to your backend to exchange for an access token.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="row-start-3 text-sm text-gray-500">
        OAuth Flow Example
      </footer>
    </div>
  );
}
