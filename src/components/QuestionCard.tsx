
import { useState, useRef, useEffect } from 'react';
import { triviaService, Question } from '@/utils/triviaService';
import { typeText, playSystemSound, playTypeSound } from '@/utils/typingEffect';
import { sendProgressWebhook } from '@/utils/webhookService';

interface QuestionCardProps {
  question: Question;
  onComplete: () => void;
}

const QuestionCard = ({ question, onComplete }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const questionTextRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Type out the question when component mounts
  useEffect(() => {
    if (questionTextRef.current) {
      typeText(questionTextRef.current, question.text, 40);
    }
    
    // Load attempts
    setAttempts(triviaService.getAttempts());
  }, [question]);
  
  // Check if hint should be shown (after 3 attempts)
  useEffect(() => {
    if (attempts >= 3 && question.hint) {
      setShowHint(true);
    }
  }, [attempts, question.hint]);
  
  // Handle keypress sound effect
  const handleKeyPress = () => {
    playTypeSound();
  };
  
  // Handle answer submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !answer.trim()) return;
    
    setLoading(true);
    
    // Check the answer
    const isCorrect = triviaService.checkAnswer(answer);
    
    // Update local attempts counter
    setAttempts(triviaService.getAttempts());
    
    if (isCorrect) {
      setFeedback('correct');
      playSystemSound('access');
      
      // Send webhook notification about progress
      const username = triviaService.getCurrentUser() || 'unknown';
      const nextQuestion = triviaService.getCurrentQuestionNumber();
      sendProgressWebhook(username, nextQuestion);
      
      // Delay before moving to next question
      setTimeout(() => {
        setAnswer('');
        setFeedback(null);
        setLoading(false);
        setShowHint(false);
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
        
        {showHint && question.hint && (
          <div className="mt-4 text-yellow-500 border-t border-yellow-900 pt-2">
            <span className="block text-yellow-500 mb-1">HINT:</span>
            {question.hint}
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
              disabled={loading}
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
