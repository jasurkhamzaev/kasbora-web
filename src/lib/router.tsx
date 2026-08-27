import React, { useEffect, useState } from "react";

export function useRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.replace(/^#/, "") || "/");
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function Link({ to, children, className, onClick, ...rest }: {
  to: string; children: React.ReactNode; className?: string; onClick?: () => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={`#${to}`} className={className} onClick={onClick} {...rest}>{children}</a>
  );
}
