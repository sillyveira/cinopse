import React from 'react';
import { useAuth } from '../context/Auth';

const LoginTeste = () => {
  const { isAuthenticated, user } = useAuth();

  const handleTestLogin = () => {
    // Redirect to the Silveira auth endpoint
    window.location.href = 'http://localhost:3000/auth/silveira';
  };

  // Don't show the button if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleTestLogin}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
    >
      Login Teste
    </button>
  );
};

export default LoginTeste;
