import React, { useState } from 'react';
import { login, signup } from '../services/authService';

interface AuthGateProps {
  onAuthenticated: (token: string) => void;
  message?: string | null;
}

type AuthMode = 'login' | 'signup';

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated, message }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentials = { email, password };
      const { token } = mode === 'login' ? await login(credentials) : await signup(credentials);
      onAuthenticated(token);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="font-orbitron text-3xl font-bold text-purple-400">JJRadio Secure Access</h1>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'login'
              ? 'Enter your credentials to resume your session.'
              : 'Create an account to unlock the JJRadio AI EPK Generator.'}
          </p>
          {message && (
            <p className="text-sm text-cyan-300 bg-cyan-900/30 border border-cyan-600/50 rounded-md px-3 py-2">
              {message}
            </p>
          )}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter a secure password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/40 border border-red-700/60 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-orbitron text-lg font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-md transition-colors"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {mode === 'login' ? (
            <button type="button" onClick={toggleMode} className="text-purple-400 hover:text-purple-300 font-medium">
              Need an account? Sign up
            </button>
          ) : (
            <button type="button" onClick={toggleMode} className="text-purple-400 hover:text-purple-300 font-medium">
              Already registered? Log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
