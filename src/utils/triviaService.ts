
/**
 * Trivia Service for Matrix Quest Protocol
 * Manages questions, answers, and user progress
 */

export interface Question {
  id: number;
  text: string;
  answer: string; // Case insensitive comparison will be used
  hint?: string; // Optional hint after 3 failed attempts
}

// Initial set of 10 matrix-themed questions
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What color pill did Neo take in The Matrix?",
    answer: "red",
    hint: "The opposite of blue..."
  },
  {
    id: 2,
    text: "What is the name of the ship captained by Morpheus?",
    answer: "nebuchadnezzar",
    hint: "Named after a Babylonian king..."
  },
  {
    id: 3,
    text: "What is the name of the program that guards the Oracle in The Matrix?",
    answer: "seraph",
    hint: "In religious texts, a celestial being with wings..."
  },
  {
    id: 4,
    text: "What is the last name of the character who betrays Morpheus and the crew?",
    answer: "reagan",
    hint: "The character's first name is Cypher..."
  },
  {
    id: 5,
    text: "What martial art is NOT used in the training program scene with Morpheus and Neo?",
    answer: "taekwondo",
    hint: "A Korean martial art..."
  },
  {
    id: 6,
    text: "What is the name of the AI program that Neo must visit to save Trinity?",
    answer: "merovingian",
    hint: "Named after a dynasty of Frankish kings..."
  },
  {
    id: 7,
    text: "Complete the quote: 'There is no ___.'",
    answer: "spoon",
    hint: "Something you eat soup with..."
  },
  {
    id: 8,
    text: "What is the name of the human city near the Earth's core?",
    answer: "zion",
    hint: "In religious texts, a heavenly city or utopia..."
  },
  {
    id: 9,
    text: "What is the profession of Thomas Anderson (Neo's Matrix identity)?",
    answer: "programmer",
    hint: "He writes code for a living..."
  },
  {
    id: 10,
    text: "What is the name of the actress who plays Trinity?",
    answer: "carrie-anne moss",
    hint: "First name is the same as the main character in a Stephen King novel..."
  }
];

// In a real application, we'd use a database
// For this demo, we're using localStorage to persist user progress
interface UserProgress {
  username: string;
  currentQuestion: number;
  attempts: { [questionId: number]: number };
  isLoggedIn: boolean;
}

// Mock user database (would be server-side in a real application)
// These are the staff-generated accounts
const USERS = [
  { username: "neo_01", password: "followthewhiterabbit" },
  { username: "trinity_07", password: "knwoledgeispower" },
  { username: "morpheus_66", password: "redorblue" },
  { username: "agent_smith", password: "virus" },
  { username: "oracle_42", password: "knowthyself" }
];

export const triviaService = {
  // User authentication
  login(username: string, password: string): boolean {
    const user = USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      // Initialize or load user progress
      const existingProgress = localStorage.getItem(`matrix_quest_${username}`);
      const progress: UserProgress = existingProgress 
        ? JSON.parse(existingProgress)
        : {
            username,
            currentQuestion: 1,
            attempts: {},
            isLoggedIn: true
          };
      
      progress.isLoggedIn = true;
      localStorage.setItem(`matrix_quest_${username}`, JSON.stringify(progress));
      localStorage.setItem('matrix_quest_current_user', username);
      return true;
    }
    
    return false;
  },
  
  // Log out the current user
  logout(): void {
    const username = localStorage.getItem('matrix_quest_current_user');
    if (username) {
      const progressData = localStorage.getItem(`matrix_quest_${username}`);
      if (progressData) {
        const progress: UserProgress = JSON.parse(progressData);
        progress.isLoggedIn = false;
        localStorage.setItem(`matrix_quest_${username}`, JSON.stringify(progress));
      }
      localStorage.removeItem('matrix_quest_current_user');
    }
  },
  
  // Check if a user is logged in
  isLoggedIn(): boolean {
    const username = localStorage.getItem('matrix_quest_current_user');
    if (!username) return false;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return false;
    
    const progress: UserProgress = JSON.parse(progressData);
    return progress.isLoggedIn;
  },
  
  // Get the current user's username
  getCurrentUser(): string | null {
    return localStorage.getItem('matrix_quest_current_user');
  },
  
  // Get the current question for the user
  getCurrentQuestion(): Question | null {
    const username = this.getCurrentUser();
    if (!username) return null;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return null;
    
    const progress: UserProgress = JSON.parse(progressData);
    return QUESTIONS.find(q => q.id === progress.currentQuestion) || null;
  },
  
  // Get the current question number
  getCurrentQuestionNumber(): number {
    const username = this.getCurrentUser();
    if (!username) return 0;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return 0;
    
    const progress: UserProgress = JSON.parse(progressData);
    return progress.currentQuestion;
  },
  
  // Check an answer
  checkAnswer(answer: string): boolean {
    const username = this.getCurrentUser();
    if (!username) return false;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return false;
    
    const progress: UserProgress = JSON.parse(progressData);
    const question = QUESTIONS.find(q => q.id === progress.currentQuestion);
    
    if (!question) return false;
    
    // Increment attempt counter
    if (!progress.attempts[question.id]) {
      progress.attempts[question.id] = 0;
    }
    progress.attempts[question.id]++;
    
    // Check if answer is correct (case insensitive)
    const isCorrect = answer.trim().toLowerCase() === question.answer.toLowerCase();
    
    if (isCorrect) {
      // Move to the next question
      progress.currentQuestion++;
      
      // Save progress
      localStorage.setItem(`matrix_quest_${username}`, JSON.stringify(progress));
    } else {
      // Just save the attempts
      localStorage.setItem(`matrix_quest_${username}`, JSON.stringify(progress));
    }
    
    return isCorrect;
  },
  
  // Get number of attempts for current question
  getAttempts(): number {
    const username = this.getCurrentUser();
    if (!username) return 0;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return 0;
    
    const progress: UserProgress = JSON.parse(progressData);
    const questionId = progress.currentQuestion;
    
    return progress.attempts[questionId] || 0;
  },
  
  // Check if the user has completed all questions
  isComplete(): boolean {
    const username = this.getCurrentUser();
    if (!username) return false;
    
    const progressData = localStorage.getItem(`matrix_quest_${username}`);
    if (!progressData) return false;
    
    const progress: UserProgress = JSON.parse(progressData);
    return progress.currentQuestion > QUESTIONS.length;
  },
  
  // Get total number of questions
  getTotalQuestions(): number {
    return QUESTIONS.length;
  }
};
