import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./LoadingSpinner"; // Import the spinner
import oneVectorImage from './images/onevector.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setMessage('A reset link has been sent to your email. Check your inbox for the next steps!');
        setError('');
      } else {
        throw new Error('Failed to send reset link');
      }
    } catch (error) {
      setError('Failed to send reset link. Please try again.');
      setMessage('');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#15BACD] to-[#094DA2]" />

        {/* Logo and Title */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={oneVectorImage}
              alt="OneVector Logo"
              className="w-6 h-8 md:w-10 md:h-10"
            />
            <h1
              className="text-2xl md:text-3xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]"
            >
              TalentHub
            </h1>
          </div>
          <p className="text-gray-600 text-center px-6 mb-6">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15BACD] focus:border-transparent transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#15BACD] to-[#094DA2] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[0.99] active:scale-[0.97]"
              disabled={loading} // Disable button while loading
            >
              {loading ? <LoadingSpinner /> : 'Send Reset Instructions'} {/* Show spinner or text */}
            </Button>
          </form>
        </CardContent>

        {message && (
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-center text-sm">
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="px-6 pb-6">
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
              {error}
            </div>
          </div>
        )}

        <CardFooter className="flex justify-center pb-8">
          <a href="/" className="text-sm text-gray-600 hover:text-[#15BACD] transition-colors">
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
