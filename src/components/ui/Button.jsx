import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-honda-red hover:bg-honda-red-dark text-white shadow-lg shadow-honda-red/25',
  secondary: 'bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600',
  outline: 'border-2 border-honda-red text-honda-red hover:bg-honda-red hover:text-white',
  whatsapp: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25',
  ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  fullWidth,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </motion.button>
  );
}
