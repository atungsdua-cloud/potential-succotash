import { motion } from 'framer-motion';

export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-honda-red text-white',
    promo: 'bg-gradient-to-r from-honda-red to-orange-500 text-white',
    outline: 'border border-honda-red text-honda-red',
    success: 'bg-emerald-500 text-white',
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${styles[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
}
