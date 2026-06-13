import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, ShieldAlert, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { login as apiLogin } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, setShowLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      login(data.user);
      setShowLogin(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => setShowLogin(false)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 premium-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-honda-red rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Masuk untuk mengelola konten</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-honda-red/50 transition-all"
                  placeholder="honda123"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-honda-red hover:bg-honda-red-dark
                         text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-honda-red/25
                         disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Masuk</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
