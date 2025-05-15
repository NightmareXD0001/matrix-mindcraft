
import { useState, useRef, useEffect } from 'react';
import { supabaseService, Question } from '@/utils/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { typeText, playSystemSound, playTypeSound } from '@/utils/typingEffect';
import { toast } from '@/components/ui/use-toast';

interface QuestionCardProps {
  question: Question;
  onComplete: () => void;
}

const QuestionCard = ({ question, onComplete }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showDiscordPrompt, setShowDiscordPrompt] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { user } = useAuth();
  const questionTextRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Type out the question when component mounts
  useEffect(() => {
    if (questionTextRef.current && question) {
      typeText(questionTextRef.current, question.text, 40);
    }
    
    // Load attempts if user is logged in
    const loadAttempts = async () => {
      if (user && question) {
        const attemptsCount = await supabaseService.getQuestionAttempts(user.id, question.id);
        setAttempts(attemptsCount);
        if (attemptsCount >= 3) {
          setShowDiscordPrompt(true);
        }
      }
    };
    
    loadAttempts();
  }, [question, user]);
  
  // Handle keypress sound effect
  const handleKeyPress = () => {
    playTypeSound();
  };

  // Handle answer submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !answer.trim() || !user) return;
    
    setLoading(true);
    
    try {
      // Check the answer
      const isCorrect = await supabaseService.checkAnswer(user.id, question.id, answer);
      
      // Update local attempts counter
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setShowDiscordPrompt(true);
      }
      
      if (isCorrect) {
        setFeedback('correct');
        playSystemSound('access');
        
        // Delay before moving to next question
        setTimeout(() => {
          setAnswer('');
          setFeedback(null);
          setLoading(false);
          setShowDiscordPrompt(false);
          onComplete();
        }, 2000);
      } else {
        setFeedback('incorrect');
        playSystemSound('deny');
        
        // Show feedback briefly
        setTimeout(() => {
          setFeedback(null);
          setLoading(false);
          setAnswer('');
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Question Display */}
      <div className="matrix-terminal mb-4">
        <h3 className="matrix-heading text-xl mb-4">Question {question.id}</h3>
        <div
          ref={questionTextRef}
          className="matrix-text mb-4 min-h-[60px]"
        ></div>
        
        {showDiscordPrompt && (
          <div className="mt-4 text-yellow-500 border-t border-yellow-900 pt-2">
            <span className="block text-yellow-500 mb-1">NEED ASSISTANCE?</span>
            Join our Discord community for hints and guidance:
            <a 
              href="https://discord.gg/matrixclan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-matrix-light hover:underline"
            >
              discord.gg/matrixclan
            </a>
          </div>
        )}
      </div>
      
      {/* Feedback overlay */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className={`text-4xl font-bold ${feedback === 'correct' ? 'text-matrix-light animate-matrix-glow' : 'text-red-500'}`}>
            {feedback === 'correct' ? 'CORRECT' : 'ACCESS DENIED'}
          </div>
        </div>
      )}
      
      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="matrix-terminal">
        <div className="space-y-4">
          <div>
            <label htmlFor="answer" className="matrix-text block mb-2">
              &gt; ENTER SOLUTION:
            </label>
            <input
              ref={inputRef}
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              className="matrix-input w-full px-3 py-2 border focus:outline-none"
              disabled={loading}
              autoComplete="off"
              autoFocus
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="matrix-button w-full py-2 px-4 text-center"
              disabled={loading || !user}
            >
              {loading ? 'PROCESSING...' : 'SUBMIT'}
            </button>
          </div>
        </div>
      </form>
      
      {/* Attempts tracker */}
      <div className="mt-4 text-center text-matrix-dark">
        Attempts: {attempts}
      </div>
    </div>
  );
};

export default QuestionCard;
