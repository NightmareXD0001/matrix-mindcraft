/**
 * Trivia Service for Matrix Quest Protocol
 * Manages questions, answers, and user progress
 */

import { Question, QUESTIONS } from '../data/questions';
import { USERS } from '../data/users';

// User progress interface
interface UserProgress {
  username: string;
  currentQuestion: number;
  attempts: { [questionId: number]: number };
  isLoggedIn: boolean;
}

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
