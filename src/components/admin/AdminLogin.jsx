import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { login as apiLogin } from '../../api';

export default function AdminLogin({ onLogin }) {
  const [show, setShow] = useState(false);
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
      onLogin(data.user);
      setShow(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed top-4 left-4 z-[70] p-2 sm:p-2.5 bg-gray-900/80 hover:bg-gray-900 text-white rounded-xl
                   backdrop-blur-sm transition-all duration-300 hover:scale-105"
        aria-label="Admin Login"
      >
        <ShieldAlert size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShow(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 premium-shadow"
            >
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-honda-red rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Admin Panel</h3>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
