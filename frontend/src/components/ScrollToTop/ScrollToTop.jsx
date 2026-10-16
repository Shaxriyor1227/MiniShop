import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG circular geometry
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className={`scroll-to-top-container ${isVisible ? 'visible' : ''}`}>
      <button
        type="button"
        className="scroll-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg className="scroll-progress-ring" viewBox="0 0 48 48">
          <circle
            className="scroll-progress-bg"
            cx="24"
            cy="24"
            r={radius}
            fill="transparent"
            strokeWidth="2.5"
          />
          <circle
            className="scroll-progress-bar"
            cx="24"
            cy="24"
            r={radius}
            fill="transparent"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <ArrowUp size={18} strokeWidth={2.4} className="scroll-top-arrow" />
      </button>
    </div>
  );
};

export default ScrollToTop;
