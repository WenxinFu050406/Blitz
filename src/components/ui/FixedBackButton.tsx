import { ArrowLeft } from 'lucide-react';

interface FixedBackButtonProps {
  onClick: () => void;
  label?: string;
}

export function FixedBackButton({ onClick, label }: FixedBackButtonProps) {
  return (
    <div className="sticky top-0 left-0 z-50 p-4 pointer-events-none">
      <button
        onClick={onClick}
        className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all border border-slate-200"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700" />
      </button>
      {label && (
        <span className="ml-14 text-base text-slate-800 pointer-events-none">
          {label}
        </span>
      )}
    </div>
  );
}
