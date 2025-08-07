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
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 12a5 5 0 1 0-5-5" />
        <path d="M12 22a10 10 0 0 0 10-10" />
        <path d="m14.5 9.5-5 5" />
    </svg>
  );
}
