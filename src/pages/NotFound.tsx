
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize and event listener
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Characters used in the Matrix code rain
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@+#!";
    
    // Array of drops - one per column
    const drops: number[] = [];
    
    // x below is the x coordinate
    // 1 = y coordinate of the drop (same for every drop initially)
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Initialize drop positions
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Drawing the characters
    function draw() {
      // Black semi-transparent background to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = "#00FF41";
      ctx.font = `${fontSize}px monospace`;

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // x = i * fontSize, y = drops[i] * fontSize
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Sending the drop back to the top randomly after it crosses the screen
        // Adding randomness makes gaps in the rain
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment y coordinate
        drops[i]++;
      }
    }

    // Animation loop
    const interval = setInterval(draw, 35);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-matrix-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      <div className="relative z-10 text-center px-6">
        <div className="relative bg-matrix-charcoal/70 backdrop-blur-sm p-8 rounded-lg border border-matrix-green/30 animate-pulse-glow">
          <h1 className="text-6xl font-bold mb-4 text-matrix-green">404</h1>
          <div className="text-2xl text-matrix-green mb-6 font-mono">SYSTEM ERROR</div>
          <p className="text-xl text-matrix-green/80 mb-8 font-mono">
            THE PATH YOU'RE LOOKING FOR DOESN'T EXIST IN THE MATRIX
          </p>
          <Button 
            variant="outline" 
            className="bg-transparent border-matrix-green text-matrix-green hover:bg-matrix-green/10 hover:text-white group transition-all duration-300"
            onClick={() => window.location.href = "https://thematrixclan.com"}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
            RETURN TO HOME
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
