
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MatrixRain from '@/components/MatrixRain';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/trivia');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <MatrixRain />
      
      {/* Main content */}
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="matrix-heading text-4xl mb-2">Matrix MindCraft Protocol</h1>
          <p className="matrix-text">Enter the Matrix. Complete the challenges. Free your mind.</p>
        </div>
        
        <div className="flex flex-col space-y-4 items-center">
          <Link 
            to="/auth" 
            className="matrix-button w-full max-w-sm py-3 px-6 text-center"
          >
            ENTER THE MATRIX
          </Link>
          
          <Link 
            to="/leaderboard" 
            className="matrix-text hover:text-matrix-light transition-colors"
          >
            VIEW LEADERBOARD
          </Link>
        </div>
      </div>
      
      <footer className="z-10 mt-12 text-center text-xs text-matrix-dark">
        <p>SECURED CONNECTION ESTABLISHED</p>
        <p>SIGNAL STRENGTH: OPTIMAL</p>
      </footer>
    </div>
  );
};

export default Index;
