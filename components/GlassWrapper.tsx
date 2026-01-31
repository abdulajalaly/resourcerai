import React from "react";

export function GlassWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`liquid-bg liquid-hover rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
