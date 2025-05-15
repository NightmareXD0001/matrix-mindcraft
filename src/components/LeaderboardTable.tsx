
import { useState, useEffect } from 'react';
import { supabaseService } from '@/utils/supabaseService';
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
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Get total questions count
        const count = await supabaseService.getTotalQuestions();
        setTotalQuestions(count);
        
        // Get leaderboard data
        const data = await supabaseService.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error loading leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, []);
  
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
                {entry.currentQuestion}/{totalQuestions}
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
