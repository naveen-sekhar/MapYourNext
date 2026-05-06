import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 size={sizeMap[size]} className="animate-spin text-primary-500" />
      {text && <p className="text-sm text-surface-500">{text}</p>}
    </div>
  );
}
