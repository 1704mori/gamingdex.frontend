import { useState, useCallback } from "react";

const useHover = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const hoverProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return [isHovering, hoverProps] as const;
};

export default useHover;
