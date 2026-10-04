import * as React from "react";

const ROW_HEIGHT_PX = 53;
const RESERVED_BELOW_PX = 64;
const MIN_ROWS = 3;
const MAX_ROWS = 100;

export function useResponsivePageSize<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState(MAX_ROWS);

  React.useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;

      const top = el.getBoundingClientRect().top;
      const available = window.innerHeight - top - RESERVED_BELOW_PX;
      const rows = Math.floor(available / ROW_HEIGHT_PX);

      setSize(Math.min(MAX_ROWS, Math.max(MIN_ROWS, rows)));
    };

    measure();

    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return [ref, size];
}
