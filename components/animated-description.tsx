import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
}

interface AnimatedDescriptionProps {
  children: string;
  delay?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 50, 
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={`${className} ${isComplete ? 'after:hidden' : 'after:inline-block after:w-0.5 after:h-5 after:bg-blue-500 after:ml-1 after:animate-blink'}`}>
      {displayText}
    </span>
  );
};

const AnimatedDescription: React.FC<AnimatedDescriptionProps> = ({ 
  children, 
  delay = 50, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('animated-description');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div id="animated-description" className={className}>
      {isVisible ? (
        <TypewriterText text={children} delay={delay} />
      ) : (
        <span className="opacity-0">{children}</span>
      )}
    </div>
  );
};

export default AnimatedDescription;