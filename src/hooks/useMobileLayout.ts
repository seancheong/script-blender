import { useEffect, useState } from 'react';

const MOBILE_WIDTH_THRESHOLD = 448;

/**
 * A hook that returns a boolean value indicating whether the target element is in mobile layout.
 *
 * @param {HTMLElement | null} targetElement - The target element to observe for layout changes
 * @returns {boolean} Returns true if the target element's width is less than or equal to the mobile width threshold, otherwise false.
 */
export const useMobileLayout = (targetElement: HTMLElement | null) => {
  const [isMobileLayout, setIsMobileLayout] = useState(true);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const { width } = entries[0].contentRect;
        setIsMobileLayout(width <= MOBILE_WIDTH_THRESHOLD);
      }
    });

    if (targetElement) resizeObserver.observe(targetElement);

    return () => {
      if (targetElement) resizeObserver.unobserve(targetElement);
    };
  }, [targetElement]);

  return isMobileLayout;
};
