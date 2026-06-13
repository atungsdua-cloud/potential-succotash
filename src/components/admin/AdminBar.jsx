import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Edit3, Eye, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminBar() {
  const { user, editMode, setEditMode, logout, showDashboard, setShowDashboard } = useAuth();

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[70] bg-gradient-to-r from-gray-900 to-gray-800 text-white
                   border-b border-white/10 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-2 sm:px-4 h-10 sm:h-12">
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <User size={12} className="sm:w-[14px] sm:h-[14px] text-green-400" />
              <span className="text-gray-300 hidden sm:inline">{user?.nama || 'Admin'}</span>
            </div>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                showDashboard
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <LayoutDashboard size={14} />
              {showDashboard ? 'Tutup Dashboard' : 'Dashboard'}
            </button>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                editMode
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {editMode ? <Eye size={14} /> : <Edit3 size={14} />}
              {editMode ? 'Mode Lihat' : 'Mode Edit'}
            </button>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                       bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
