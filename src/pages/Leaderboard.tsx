
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { triviaService } from '@/utils/triviaService';
import MatrixRain from '@/components/MatrixRain';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Progress } from '@/components/ui/progress';

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const totalQuestions = triviaService.getTotalQuestions();
  
  // Check authentication on load
  useEffect(() => {
    // No need to be logged in to view the leaderboard
    setLoading(false);
  }, [navigate]);
  
  // Handle back to trivia
  const handleBackToTrivia = () => {
    if (triviaService.isLoggedIn()) {
      navigate('/trivia');
    } else {
      navigate('/');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MatrixRain />
        <div className="z-10 matrix-text animate-matrix-glow">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4">
      <MatrixRain />
      
      {/* Header */}
      <header className="z-10 flex justify-between items-center mb-8">
        <div className="matrix-heading text-2xl">Matrix MindCraft Leaderboard</div>
        <button
          onClick={handleBackToTrivia}
          className="matrix-button px-3 py-1"
        >
          {triviaService.isLoggedIn() ? 'BACK TO TRIVIA' : 'LOG IN'}
        </button>
      </header>
      
      {/* Main content */}
      <main className="z-10 flex-grow flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <LeaderboardTable />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="z-10 mt-8 text-center text-xs text-matrix-dark">
        <p>Matrix MindCraft Protocol v1.2.5</p>
        <p>ALL SYSTEMS OPERATIONAL</p>
      </footer>
    </div>
  );
};

export default Leaderboard;
