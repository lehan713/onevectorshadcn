import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import oneVectorImage from './images/onevector.png';
import LoadingSpinner from './LoadingSpinner'; // Import the spinner

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const validatePassword = (password) => ({
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  });

  useEffect(() => {
    setValidations(validatePassword(newPassword));
  }, [newPassword]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-500' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden relative">
        {/* Gradient header line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#15BACD] to-[#094DA2]" />

        {/* Logo and Title */}
        <CardHeader className="flex items-center justify-center space-y-4 py-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={oneVectorImage}
                alt="OneVector Logo"
                className="w-10 h-10"
              />
              <h1
                className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]"
              >
                TalentHub
              </h1>
            </div>
            <p className="text-gray-600 text-center">
              Please enter your new password below
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15BACD] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? 
                      <EyeOffIcon className="h-5 w-5" /> : 
                      <EyeIcon className="h-5 w-5" />
                    }
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <ValidationItem 
                    isValid={validations.minLength} 
                    text="Minimum 8 characters" 
                  />
                  <ValidationItem 
                    isValid={validations.hasUpperCase} 
                    text="At least one uppercase letter" 
                  />
                  <ValidationItem 
                    isValid={validations.hasNumber} 
                    text="At least one number" 
                  />
                  <ValidationItem 
                    isValid={validations.hasSpecial} 
                    text="At least one special character" 
                  />
                </div>

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15BACD] focus:border-transparent transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full py-3 bg-gradient-to-r from-[#15BACD] to-[#094DA2] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[0.99] active:scale-[0.97] ${!isPasswordValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>

        {message && (
          <div className="px-6 pb-6">
            <Alert className="bg-green-50 border border-green-100">
              <AlertDescription className="text-green-700 text-center">
                {message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <div className="px-6 pb-6">
            <Alert className="bg-red-50 border border-red-100">
              <AlertDescription className="text-red-700 text-center">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardFooter className="flex justify-center pb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-[#15BACD] transition-colors"
          >
            Back to Login
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
