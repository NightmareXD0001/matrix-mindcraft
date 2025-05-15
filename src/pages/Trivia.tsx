
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService, Question } from '@/utils/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import MatrixRain from '@/components/MatrixRain';
import QuestionCard from '@/components/QuestionCard';
import { toast } from '@/components/ui/use-toast';

const Trivia = () => {
  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Load questions and user progress
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        // Load questions
        const allQuestions = await supabaseService.getQuestions();
        setQuestions(allQuestions);
        setTotalQuestions(allQuestions.length);
        
        // Load user progress
        const progress = await supabaseService.getUserProgress(user.id);
        
        if (progress) {
          if (progress.completed) {
            setComplete(true);
          } else {
            const questionIndex = progress.current_question - 1;
            if (questionIndex < allQuestions.length) {
              setCurrentQuestion(allQuestions[questionIndex]);
              setCurrentQuestionNumber(progress.current_question);
            } else {
              setComplete(true);
            }
          }
        } else if (allQuestions.length > 0) {
          // Default to first question if no progress is found
          setCurrentQuestion(allQuestions[0]);
          setCurrentQuestionNumber(1);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading trivia data:", error);
        toast({
          title: "Error",
          description: "Failed to load trivia data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  // Handle question completion
  const handleQuestionComplete = async () => {
    if (!user) return;
    
    try {
      const progress = await supabaseService.getUserProgress(user.id);
      
      if (progress) {
        if (progress.completed || progress.current_question > totalQuestions) {
          setComplete(true);
        } else {
          const nextQuestionIndex = progress.current_question - 1;
          
          if (nextQuestionIndex < questions.length) {
            setCurrentQuestion(questions[nextQuestionIndex]);
            setCurrentQuestionNumber(progress.current_question);
          } else {
            setComplete(true);
          }
        }
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Failed to update question progress.",
        variant: "destructive"
      });
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
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
              "You are The One, {user?.user_metadata?.username || 'Neo'}."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLogout}
                className="matrix-button px-6 py-2"
              >
                EXIT MATRIX
              </button>
              <Link to="/leaderboard" className="matrix-button px-6 py-2">
                VIEW LEADERBOARD
              </Link>
            </div>
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
          User: <span className="text-matrix-light">{user?.user_metadata?.username || user?.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="matrix-text">
            Progress: {currentQuestionNumber}/{totalQuestions}
          </div>
          <Link to="/leaderboard" className="matrix-button px-3 py-1 text-sm">
            LEADERBOARD
          </Link>
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
