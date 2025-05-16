
/**
 * API Service for Matrix MindCraft Protocol
 * Handles external API requests for authentication and answer checking
 */

const API_BASE_URL = "https://api.thematrixclan.com/api";

export interface ApiResponse {
  status: "correct" | "incorrect";
}

export const apiService = {
  /**
   * Authenticate user with external API
   * @param username Username
   * @param password Password
   * @returns Promise resolving to a boolean indicating success
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error("Login API error:", response.status);
        return false;
      }

      const data = await response.json() as ApiResponse;
      return data.status === "correct";
    } catch (error) {
      console.error("Login API error:", error);
      return false;
    }
  },

  /**
   * Check answer with external API
   * @param questionNumber The question number (1-10)
   * @param userAnswer User's answer
   * @param username Username
   * @returns Promise resolving to a boolean indicating if answer is correct
   */
  async checkAnswer(questionNumber: number, userAnswer: string, username: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/mindcraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_number: questionNumber,
          user_answer: userAnswer,
          username: username,
        }),
      });

      if (!response.ok) {
        console.error("Check answer API error:", response.status);
        return false;
      }

      const data = await response.json() as ApiResponse;
      return data.status === "correct";
    } catch (error) {
      console.error("Check answer API error:", error);
      return false;
    }
  }
};
