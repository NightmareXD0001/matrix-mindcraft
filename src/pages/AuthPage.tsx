
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '@/components/MatrixRain';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/trivia');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!username.trim()) {
          toast({
            title: "Username required",
            description: "Please enter a username to continue.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Account created. Please check your email for verification.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <MatrixRain />
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="matrix-heading text-4xl mb-2">
            {isLogin ? 'Enter The Matrix' : 'Join The Resistance'}
          </h1>
          <p className="matrix-text">
            {isLogin 
              ? 'Login to continue your journey.' 
              : 'Create an account to begin your training.'}
          </p>
        </div>
        
        <div className="matrix-terminal p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="matrix-text block mb-2">
                  &gt; CODENAME:
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="matrix-input w-full px-3 py-2 border focus:outline-none"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="matrix-text block mb-2">
                &gt; ACCESS ID:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="matrix-input w-full px-3 py-2 border focus:outline-none"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="matrix-text block mb-2">
                &gt; ACCESS KEY:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="matrix-input w-full px-3 py-2 border focus:outline-none"
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="matrix-button w-full py-2 px-4 text-center"
                disabled={loading}
              >
                {loading ? 'PROCESSING...' : isLogin ? 'AUTHENTICATE' : 'REGISTER'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-matrix-dark hover:text-matrix-light transition-colors"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-matrix-dark">
        <p>SECURED CONNECTION ESTABLISHED</p>
        <p>SIGNAL STRENGTH: OPTIMAL</p>
      </div>
    </div>
  );
};

export default AuthPage;
