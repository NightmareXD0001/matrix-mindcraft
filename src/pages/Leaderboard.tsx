
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '@/components/MatrixRain';
import LeaderboardTable from '@/components/LeaderboardTable';
import { supabaseService } from '@/utils/supabaseService';
import { useAuth } from '@/hooks/useAuth';

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const count = await supabaseService.getTotalQuestions();
        setTotalQuestions(count);
      } catch (error) {
        console.error("Error loading question count:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle back to trivia/home
  const handleBack = () => {
    if (user) {
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
          onClick={handleBack}
          className="matrix-button px-3 py-1"
        >
          {user ? 'BACK TO TRIVIA' : 'BACK TO HOME'}
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
