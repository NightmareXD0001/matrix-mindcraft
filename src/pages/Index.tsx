import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '@/components/MatrixRain';
import LoginForm from '@/components/LoginForm';
import { triviaService } from '@/utils/triviaService';

const Index = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (triviaService.isLoggedIn()) {
      navigate('/trivia');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <MatrixRain />
      
      {/* Main content */}
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="matrix-heading text-4xl mb-2">MATRIX QUEST PROTOCOL</h1>
          <p className="matrix-text">Enter the Matrix. Complete the challenges. Free your mind.</p>
        </div>
        
        <LoginForm />
      </div>
      
      <footer className="z-10 mt-12 text-center text-xs text-matrix-dark">
        <p>SECURED CONNECTION ESTABLISHED</p>
        <p>SIGNAL STRENGTH: OPTIMAL</p>
      </footer>
    </div>
  );
};

export default Index;
