
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { triviaService } from '@/utils/triviaService';
import MatrixRain from '@/components/MatrixRain';
import QuestionCard from '@/components/QuestionCard';

const Trivia = () => {
  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication on load
  useEffect(() => {
    if (!triviaService.isLoggedIn()) {
      navigate('/');
      return;
    }
    
    // Check if user has completed all questions
    if (triviaService.isComplete()) {
      setComplete(true);
    }
    
    setLoading(false);
  }, [navigate]);
  
  // Handle question completion
  const handleQuestionComplete = () => {
    // Check if user has completed all questions
    if (triviaService.isComplete()) {
      setComplete(true);
    } else {
      // Force re-render to get next question
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    triviaService.logout();
    navigate('/');
  };
  
  // Get current question and progress information
  const currentQuestion = triviaService.getCurrentQuestion();
  const currentQuestionNumber = triviaService.getCurrentQuestionNumber();
  const totalQuestions = triviaService.getTotalQuestions();
  const username = triviaService.getCurrentUser();
  
  // Render completion screen if all questions answered
  if (complete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MatrixRain />
        <div className="z-10 w-full max-w-md">
          <div className="matrix-terminal text-center p-8">
            <h1 className="matrix-heading text-2xl mb-6">MISSION COMPLETE</h1>
            <p className="matrix-text mb-4">
              You have successfully completed all challenges in the Matrix Quest Protocol.
            </p>
            <p className="matrix-text mb-8">
              "You are The One, {username}."
            </p>
            <button
              onClick={handleLogout}
              className="matrix-button px-6 py-2"
            >
              EXIT MATRIX
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (loading || !currentQuestion) {
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
        <div className="matrix-text">
          User: <span className="text-matrix-light">{username}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="matrix-text">
            Progress: {currentQuestionNumber}/{totalQuestions}
          </div>
          <button
            onClick={handleLogout}
            className="matrix-button px-3 py-1 text-sm"
          >
            LOGOUT
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="z-10 flex-grow flex items-center justify-center">
        <QuestionCard
          question={currentQuestion}
          onComplete={handleQuestionComplete}
        />
      </main>
      
      {/* Footer */}
      <footer className="z-10 mt-8 text-center text-xs text-matrix-dark">
        <p>Matrix MindCraft Protocol v1.2.5</p>
        <p>ALL SYSTEMS OPERATIONAL</p>
      </footer>
    </div>
  );
};

export default Trivia;
