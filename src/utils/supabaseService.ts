
import { supabase } from '@/utils/supabaseClient';

export interface Question {
  id: number;
  text: string;
  answer: string;
  hint?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  current_question: number;
  completed: boolean;
  completed_at: string | null;
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: number;
  attempts: number;
}

export const supabaseService = {
  // Get questions
  async getQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get a specific question by ID
  async getQuestion(id: number): Promise<Question | null> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching question ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Get current user progress
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching user progress:', error);
      }
      return null;
    }
    
    return data;
  },
  
  // Get question attempts for a user
  async getQuestionAttempts(userId: string, questionId: number): Promise<number> {
    const { data, error } = await supabase
      .from('question_attempts')
      .select('attempts')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching question attempts:', error);
      return 0;
    }
    
    return data?.attempts || 0;
  },
  
  // Update question attempts
  async incrementAttempts(userId: string, questionId: number): Promise<number> {
    // First, check if we have an existing record
    const { data: existingRecord } = await supabase
      .from('question_attempts')
      .select('id, attempts')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle();
      
    if (existingRecord) {
      // Update existing record
      const newAttempts = existingRecord.attempts + 1;
      const { error } = await supabase
        .from('question_attempts')
        .update({ attempts: newAttempts, updated_at: new Date().toISOString() })
        .eq('id', existingRecord.id);
        
      if (error) {
        console.error('Error updating attempts:', error);
        return existingRecord.attempts;
      }
      
      return newAttempts;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('question_attempts')
        .insert({ user_id: userId, question_id: questionId, attempts: 1 });
        
      if (error) {
        console.error('Error inserting attempts:', error);
        return 0;
      }
      
      return 1;
    }
  },
  
  // Update user progress
  async updateUserProgress(userId: string, currentQuestion: number): Promise<boolean> {
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    let error;
    
    if (existingProgress) {
      const completed = currentQuestion > await this.getTotalQuestions();
      const updates: any = { 
        current_question: currentQuestion,
        updated_at: new Date().toISOString(),
        completed
      };
      
      if (completed) {
        updates.completed_at = new Date().toISOString();
      }
      
      ({ error } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('id', existingProgress.id));
    } else {
      ({ error } = await supabase
        .from('user_progress')
        .insert({ user_id: userId, current_question: currentQuestion }));
    }
    
    if (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
    
    return true;
  },
  
  // Check answer
  async checkAnswer(userId: string, questionId: number, answer: string): Promise<boolean> {
    // Get the question
    const question = await this.getQuestion(questionId);
    if (!question) return false;
    
    // Increment attempts counter
    await this.incrementAttempts(userId, questionId);
    
    // Check if the answer is correct (case insensitive)
    const isCorrect = answer.trim().toLowerCase() === question.answer.toLowerCase();
    
    if (isCorrect) {
      // Get current progress
      const progress = await this.getUserProgress(userId);
      const nextQuestion = progress ? progress.current_question + 1 : 2;
      
      // Update progress
      await this.updateUserProgress(userId, nextQuestion);
    }
    
    return isCorrect;
  },
  
  // Get total questions count
  async getTotalQuestions(): Promise<number> {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error getting question count:', error);
      return 0;
    }
    
    return count || 0;
  },
  
  // Get leaderboard data
  async getLeaderboard(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        username,
        user_progress!inner (current_question, completed, completed_at)
      `)
      .order('completed_at', { ascending: false, nullsLast: true })
      .order('current_question', { ascending: false });
      
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    // Transform data for display
    const totalQuestions = await this.getTotalQuestions();
    
    return (data || []).map(item => {
      const progress = item.user_progress[0];
      return {
        username: item.username,
        currentQuestion: progress.current_question - 1,
        completed: progress.completed,
        progress: Math.min(Math.floor((progress.current_question - 1) / totalQuestions * 100), 100)
      };
    });
  }
};
