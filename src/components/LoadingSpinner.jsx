export function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center p-10'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent' />
    </div>
  );
}
