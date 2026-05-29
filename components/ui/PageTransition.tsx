"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div key={`${pathname}?${searchParams.toString()}`} className="animate-fade-in">
      {children}
    </div>
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <TransitionWrapper>{children}</TransitionWrapper>
    </Suspense>
  );
}
