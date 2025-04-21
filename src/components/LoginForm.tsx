
import { useState, useRef, useEffect } from 'react';
import { triviaService } from '@/utils/triviaService';
import { useNavigate } from 'react-router-dom';
import { typeText, playSystemSound, playTypeSound } from '@/utils/typingEffect';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [accessMessageText, setAccessMessageText] = useState('');
  
  const terminalTextRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Initialize terminal text
  useEffect(() => {
    const introText = '> Initializing Matrix MindCraft Protocol v1.2.5...\n> Establishing secure connection...\n> Enter credentials to continue.';
    
    if (terminalTextRef.current) {
      typeText(terminalTextRef.current, introText, 40);
    }
  }, []);
  
  // Handle keystroke sounds
  const handleKeyPress = () => {
    playTypeSound();
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (terminalTextRef.current) {
      await typeText(terminalTextRef.current, `\n> Authenticating user: ${username}...`, 30);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = triviaService.login(username, password);
    
    if (success) {
      setAccessMessageText('ACCESS GRANTED');
      setShowAccessMessage(true);
      playSystemSound('access');
      
      if (terminalTextRef.current) {
        await typeText(
          terminalTextRef.current, 
          '\n> Authentication successful.\n> Welcome to the Matrix MindCraft.\n> Redirecting to secure area...',
          30
        );
      }
      
      // Redirect after animation completes
      setTimeout(() => {
        navigate('/trivia');
      }, 2000);
    } else {
      setAccessMessageText('ACCESS DENIED');
      setShowAccessMessage(true);
      playSystemSound('deny');
      
      if (terminalTextRef.current) {
        await typeText(
          terminalTextRef.current, 
          '\n> Authentication failed.\n> Invalid credentials or access restricted.\n> Please try again.',
          30
        );
      }
      
      setTimeout(() => {
        setShowAccessMessage(false);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Terminal display */}
      <div className="matrix-terminal mb-6 min-h-[180px]">
        <div 
          ref={terminalTextRef} 
          className="matrix-text whitespace-pre-line"
        ></div>
      </div>
      
      {/* Access message overlay */}
      {showAccessMessage && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-500`}>
          <div className={`text-6xl font-bold ${accessMessageText === 'ACCESS GRANTED' ? 'text-matrix-light animate-matrix-glow' : 'text-red-500'}`}>
            {accessMessageText}
          </div>
        </div>
      )}
      
      {/* Login form */}
      <form onSubmit={handleSubmit} className="matrix-terminal">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="matrix-text block mb-2">
              &gt; USERNAME:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              className="matrix-input w-full px-3 py-2 border focus:outline-none"
              disabled={loading}
              autoComplete="off"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="matrix-text block mb-2">
              &gt; PASSWORD:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="matrix-input w-full px-3 py-2 border focus:outline-none"
              disabled={loading}
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm py-2">
              {error}
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              className="matrix-button w-full py-2 px-4 text-center"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-xs text-matrix-dark text-center">
        <p>Matrix MindCraft Protocol v1.2.5</p>
        <p>AUTHORIZED ACCESS ONLY</p>
        <p>&copy; 2025–2026 Matrix Clan. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginForm;
