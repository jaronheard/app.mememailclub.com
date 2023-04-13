import React from "react";

interface ComingSoonProps {
  children: React.ReactNode;
}

function ComingSoon({ children }: ComingSoonProps) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0">
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-b from-white/60 to-white/80 p-4">
          <div className="p-4 text-2xl font-bold text-indigo-600">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
