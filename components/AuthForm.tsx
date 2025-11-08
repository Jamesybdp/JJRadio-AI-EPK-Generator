
import React, { useState } from 'react';
import { InputField } from './InputField';
import { AlienIcon } from './icons';
import { login } from '../services/authService';

interface AuthFormProps {
  onLogin: (token: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use the authService to perform a real login request.
      const { token } = await login(email, password);
      onLogin(token);
    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError('An unknown authentication error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <header className="text-center mb-8">
            <div className="inline-block bg-purple-500/20 p-4 rounded-full mb-4 border border-purple-400/50">
                <AlienIcon className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold text-purple-400 tracking-wider">
                JJRadio Secure Access
            </h1>
            <p className="mt-2 text-lg text-cyan-300">
                Authentication Required
            </p>
        </header>

        <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField 
                    label="Access Email" 
                    name="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                />
                <InputField 
                    label="Passphrase" 
                    name="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full font-orbitron flex items-center justify-center gap-2 text-lg font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                    {loading ? 'Authenticating...' : 'Connect'}
                </button>
            </form>
            {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        </div>
      </div>
    </div>
  );
};
