
import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters - taken from the Matrix code
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y-coordinate of each column
    const drops: number[] = [];
    
    // Initialize all columns to start at random positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Drawing the characters
    const draw = () => {
      // Black with opacity to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px matrix`;
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Move drop down
        drops[i]++;
        
        // Reset drop to top with random delay when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };
    
    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps
    
    // Handle resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset columns count and drops array
      const newColumns = Math.floor(canvas.width / fontSize);
      const newDrops = [];
      
      for (let i = 0; i < newColumns; i++) {
        newDrops[i] = i < drops.length ? drops[i] : Math.random() * -100;
      }
      
      drops.length = 0;
      drops.push(...newDrops);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-code-rain"
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
