"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Callback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("Processing...");
  const [code, setCode] = useState<string | null>(null);
  const [exchangeResult, setExchangeResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the authorization code from the URL
    const authCode = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setStatus("Error");
      setError(errorParam);
      return;
    }

    if (!authCode) {
      setStatus("Error");
      setError("No authorization code received");
      return;
    }

    setCode(authCode);
    setStatus("Success! Authorization code received");

    // In a real application, you would exchange this code for an access token
    // by making a request to your backend server
    // For this example, we'll just display the code

    // Optional: close the popup and communicate with the opener window
    if (window.opener) {
      if (errorParam) {
        // Send error information back to the parent window
        window.opener.postMessage(
          { 
            type: "OAUTH_CALLBACK", 
            error: errorParam,
            state 
          },
          "*"
        );
      } else {
        // Send a message to the parent window with the authorization code
        window.opener.postMessage(
          { 
            type: "OAUTH_CALLBACK", 
            code: authCode, 
            state 
          },
          "*"
        );
      }

      // Close after a short delay
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {code && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Authorization Code:</p>
            <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm">
              {code}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          {window.opener
            ? "This window will close automatically..."
            : "You can close this window and return to the application."}
        </p>
      </div>
    </div>
  );
}

