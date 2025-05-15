
import { useState, useEffect } from 'react';
import { triviaService } from '@/utils/triviaService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface LeaderboardEntry {
  username: string;
  currentQuestion: number;
  completed: boolean;
  progress: number;
}

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load leaderboard data from localStorage
    loadLeaderboardData();
  }, []);
  
  const loadLeaderboardData = () => {
    const totalQuestions = triviaService.getTotalQuestions();
    const leaderboardData: LeaderboardEntry[] = [];
    
    // Scan all localStorage for data starting with matrix_quest_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('matrix_quest_') && key !== 'matrix_quest_current_user') {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          const username = key.replace('matrix_quest_', '');
          const currentQuestion = userData.currentQuestion || 1;
          const completed = currentQuestion > totalQuestions;
          const progress = Math.min(Math.floor((currentQuestion - 1) / totalQuestions * 100), 100);
          
          leaderboardData.push({
            username,
            currentQuestion: completed ? totalQuestions : currentQuestion - 1,
            completed,
            progress
          });
        } catch (error) {
          console.error(`Error parsing data for ${key}:`, error);
        }
      }
    }
    
    // Sort by progress (descending) and then by username (ascending)
    leaderboardData.sort((a, b) => {
      if (b.progress !== a.progress) {
        return b.progress - a.progress;
      }
      return a.username.localeCompare(b.username);
    });
    
    setLeaderboard(leaderboardData);
    setLoading(false);
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading leaderboard data...</div>;
  }
  
  if (leaderboard.length === 0) {
    return (
      <div className="matrix-terminal p-8 text-center">
        <p className="matrix-text">No participants have joined the Matrix MindCraft Protocol yet.</p>
      </div>
    );
  }
  
  return (
    <div className="matrix-terminal">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <TableRow key={entry.username}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-mono">{entry.username}</TableCell>
              <TableCell className="w-64">
                <Progress value={entry.progress} className="h-2 bg-matrix-dark" />
                <span className="text-xs text-matrix-light mt-1 inline-block">
                  {entry.progress}%
                </span>
              </TableCell>
              <TableCell>
                {entry.currentQuestion}/{triviaService.getTotalQuestions()}
              </TableCell>
              <TableCell>
                {entry.completed ? (
                  <span className="text-matrix-light animate-matrix-glow">COMPLETED</span>
                ) : (
                  <span className="text-matrix-dark">IN PROGRESS</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
