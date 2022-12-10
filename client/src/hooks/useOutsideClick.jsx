import { useEffect } from "react";
export function useOutsideClick(ref, onClickOut){
  useEffect(() => {
    if (ref) {
      const onClick = ({target}) => !ref.contains(target) && onClickOut?.()
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [ref]);
}
