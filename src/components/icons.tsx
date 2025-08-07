import type { SVGProps } from "react";

export function TryQuadLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15.5 14h.01" />
      <path d="M8.5 14h.01" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10Z" />
      <path d="M18 10h-1.26a2 2 0 1 0-3.48 0H6" />
    </svg>
  );
}
