export default function AnimatedButton({ children, className = '', ...rest }) {
  return (
    <button
      {...rest}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 ${className}`}
    >
      <span className='animate-pulse-btn inline-block'>{children}</span>
    </button>
  );
}
