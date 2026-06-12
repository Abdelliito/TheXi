import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll the window back to the top whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default ScrollToTop;
