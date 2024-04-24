import React, { ReactNode, useEffect, useState } from 'react'
import { Button, Input, Link } from '@chakra-ui/react'
import {
  Container,
  Box,
  P,
  VStack,
  HStack,
  H1,
  H2,
} from '@northlight/ui'
import { palette } from '@northlight/tokens'
import { ExcelDropzone, ExcelRow } from './excel-dropzone.jsx'
import usersData from './users.js';
import scoresData from './scores.js';
import { UserData, ScoreData, RankingData } from './types.js'

interface ExternalLinkProps {
  href: string,
  children: ReactNode,
}

const ExternalLink = ({ href, children }: ExternalLinkProps) => <Link href={href} isExternal sx={ {color: palette.blue['500'], textDecoration: 'underline'} }>{ children }</Link>

export default function App () {

  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [userScores, setUserScores] = useState<RankingData[]>([])
  const [formData, setFormData] = useState<{ name: string; score: number }>({ name: '', score: 0 });

  // UseEffect for setting the initial ranking data from scoresData and usersData
  useEffect(() => {
    const initialRanking: RankingData[] = usersData.map((user: UserData) => {
      const userScores: ScoreData[] = scoresData.filter((score: ScoreData) => score.userId === user._id);
      const bestScore: number = userScores.reduce((max: number, score: ScoreData) => Math.max(max, score.score), 0);
      return { _id: user._id, name: user.name, score: bestScore };
    });
    const sortedInitialRanking: RankingData[] = initialRanking.sort((a: RankingData, b: RankingData) => b.score - a.score);

    setRanking(sortedInitialRanking);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, score } = formData;
    const existingUser = ranking.find(user => user.name === name);
  
    if (existingUser) {
      setRanking(prevRanking => {
        const updatedRanking = prevRanking.map(user => {
          if (user.name === name) {
            return { ...user, score: user.score + score };
          }
          return user;
        });
  
        const sortedUpdatedRanking = updatedRanking.sort((a, b) => b.score - a.score);
        return sortedUpdatedRanking;
      });
    } else {
      setRanking(prevRanking => {
        const newUserId = prevRanking.length + 1;
        const newRanking = [...prevRanking, { _id: newUserId, name, score }];
  
        const sortedNewRanking = newRanking.sort((a, b) => b.score - a.score);
        return sortedNewRanking;
      });
    }
    setFormData({ name: '', score: 0 });
  };

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  
    const selectedUserScores = scoresData.filter((score: ScoreData) => score.userId === userId);
    
    const userScoresWithId: RankingData[] = selectedUserScores.map((score: ScoreData) => ({
      _id: userId,
      name: usersData.find((user: UserData) => user._id === userId)?.name || '',
      score: score.score,
    }));
    
    const sortedUserScores = userScoresWithId.sort((a: RankingData, b: RankingData) => b.score - a.score);
  
    setUserScores(sortedUserScores);
  };

  function handleSheetData(data: ExcelRow[]) {

    const userIdMap: { [key: string]: number } = {};
    
    const usersFromExcel: RankingData[] = data.map((row: ExcelRow) => {
    const userId = userIdMap[row.name] ?? Object.keys(userIdMap).length + 1;
    userIdMap[row.name] = userId;
  
      return {
        _id: userId,
        name: row.name,
        score: row.score,
      };
    });
  
    const mergedRanking = Array.from(new Set([...usersFromExcel, ...ranking]));
  
    const sortedRanking = mergedRanking.sort((a, b) => b.score - a.score);
  
    setRanking(sortedRanking);
  }
  

  return (
    <Container maxW="6xl" padding="4">
      <H1 marginBottom="4" >Mediatool exercise</H1>
      <HStack spacing={10} align="flex-start">
        <ExcelDropzone
          onSheetDrop={handleSheetData}
          label="Import excel file here"
        />
        <VStack align="left">
          <Box>
            <H2>Initial site</H2>
            <P>
              Drop the excel file scores.xlsx that you will find
              in this repo in the area to the left and watch the log output in the console.
              We hope this is enough to get you started with the import.
            </P>
          </Box>
          <Box>
            <H2>Ranking List</H2>
            {/* Render the ranking list */}
            <ol>
              {ranking.slice(0, 9).map((user) => (
                <li key={user._id} onClick={() => handleUserClick(user._id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  {user.name} - Score: {user.score}
                </li>
              ))}
            </ol>
          </Box>
          <Box>
            <H2>{usersData.find((user: UserData) => user._id === selectedUserId)?.name} Scores</H2>
            {/* Render the user scores */}
            <ol>
              {userScores.map((score, index) => (
                <li key={`${score._id}-${index}`}>
                  Score: {score.score}
                </li>
              ))}
            </ol>
          </Box>
          <form onSubmit={handleSubmit}>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" />
            <Input type="number" name="score" value={formData.score} onChange={handleInputChange}/>
            <Button type="submit">Add</Button>
          </form>
        </VStack>
      </HStack>
    </Container>
  )
}
