import { getRandomPG13Prompt } from "./generated-data/Prompts.pg13";
import { getRandomPicturePrompt } from "./generated-data/Prompts.pics";

const POINTS_PER_VOTE = 100;
const promptsForRoom = {};

// Keep track of how many answers are submitted.  Wait until all answers are in before starting game.
const numberOfAnswersForRoom = {};
// Keep track of prompts that haven't been displayed and voted on yet.
const unusedPromptsForRoom = {};
// Keep track of winning answers for the score screen
const winningAnswersForRoom = {};

export function deleteSavedPromptsForRoom(roomCode) {
  delete numberOfAnswersForRoom[roomCode];
  delete promptsForRoom[roomCode];
  delete unusedPromptsForRoom[roomCode];
  delete winningAnswersForRoom[roomCode];
}

export function getOnePromptAndAnswersForRoom(roomCode) {
  const prompt = unusedPromptsForRoom[roomCode].pop();
  const submitters = [];
  Object.values(promptsForRoom[roomCode][prompt]).forEach((answerProps) => {
    submitters.push(answerProps.submitter);
  });
  return {
    answers: Object.keys(promptsForRoom[roomCode][prompt]),
    prompt,
    submitters,
  };
}

export function getNumberOfAnswersForRoom(roomCode) {
  return numberOfAnswersForRoom[roomCode];
}

export function getPopularAnswers(roomCode) {
  const winningAnswers = Object.values(winningAnswersForRoom[roomCode]);
  winningAnswers.sort((a, b) => (a.points > b.points ? -1 : 1));
  return winningAnswers;
}

export function getVotes(prompt, roomCode, numberOfPlayers) {
  const votes = [];
  Object.entries(promptsForRoom[roomCode][prompt]).forEach(([answer, properties]) => {
    const totalVotesForAnswer = properties.votes ? properties.votes : [];
    votes.push({
      answer,
      points: totalVotesForAnswer.length * POINTS_PER_VOTE,
      submitter: properties.submitter,
      votes: totalVotesForAnswer,
    });
  });
  // workaround in case both answers are the same
  if (!votes[1]) {
    votes[1] = { answer: "N/A", submitter: "Generated", votes: [] };
  }

  const answer1Votes = votes[0].votes.length;
  const answer2Votes = votes[1].votes.length;
  if (answer1Votes > answer2Votes) {
    votes[0].points += POINTS_PER_VOTE;
    if (answer1Votes > 1 && answer1Votes === numberOfPlayers - 2) {
      votes[0].quiplash = true;
      votes[0].points *= 2;
    }
    votes[0].state = "WINNER";
    votes[1].state = "LOSER";

    if (
      winningAnswersForRoom[roomCode][votes[0].answer] &&
      winningAnswersForRoom[roomCode][votes[0].answer].points < votes[0].points
    ) {
      winningAnswersForRoom[roomCode][votes[0].answer] = votes[0];
    } else {
      winningAnswersForRoom[roomCode][votes[0].answer] = votes[0];
    }
  } else if (answer2Votes > answer1Votes) {
    votes[1].points += POINTS_PER_VOTE;
    if (answer2Votes > 1 && answer2Votes === numberOfPlayers - 2) {
      votes[1].quiplash = true;
      votes[1].points *= 2;
    }
    votes[0].state = "LOSER";
    votes[1].state = "WINNER";

    if (
      winningAnswersForRoom[roomCode][votes[1].answer] &&
      winningAnswersForRoom[roomCode][votes[1].answer].points < votes[1].points
    ) {
      winningAnswersForRoom[roomCode][votes[1].answer] = votes[1];
    } else {
      winningAnswersForRoom[roomCode][votes[1].answer] = votes[1];
    }
  } else {
    votes[0].state = "TIE";
    votes[1].state = "TIE";
  }

  return votes;
}

export function hasMorePromptsForRoom(roomCode) {
  return unusedPromptsForRoom[roomCode].length > 0;
}

export function storeAnswerForPrompt({ prompt, playerName, answer, roomCode }) {
  numberOfAnswersForRoom[roomCode]++;
  if (promptsForRoom[roomCode] && promptsForRoom[roomCode][prompt]) {
    let realAnswer = answer;
    // Check for duplicate answer and add ditto to it
    if (promptsForRoom[roomCode][prompt][answer]) {
      realAnswer = answer + " ditto";
    }
    promptsForRoom[roomCode][prompt][realAnswer] = {};
    promptsForRoom[roomCode][prompt][realAnswer].submitter = playerName;
  }
}

export function storeVoteForPrompt({ prompt, playerName, roomCode, answerVotedFor }) {
  if (!promptsForRoom[roomCode][prompt][answerVotedFor].votes) {
    promptsForRoom[roomCode][prompt][answerVotedFor].votes = [];
  }
  promptsForRoom[roomCode][prompt][answerVotedFor].votes.push(playerName);
}

export function assignPromptsForPlayers({ players, roomCode, roomOptions }) {
  if (promptsForRoom[roomCode]) {
    deleteSavedPromptsForRoom(roomCode);
  }
  promptsForRoom[roomCode] = {};
  numberOfAnswersForRoom[roomCode] = 0;
  unusedPromptsForRoom[roomCode] = [];
  winningAnswersForRoom[roomCode] = [];
  const promptsForPlayers = [];

  // Total number of prompts is equal to the number of players
  const prompts = [];
  for (let i = 0; i < players.length; i++) {
    let prompt;
    do {
      prompt = roomOptions.allowPictureUploads ? getRandomPicturePrompt() : getRandomPG13Prompt();
    } while (prompts.includes(prompt));
    prompts.push(prompt);
    promptsForRoom[roomCode][prompt] = {};
    unusedPromptsForRoom[roomCode].push(prompt);
  }

  switch (players.length) {
    case 3: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[1]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[2]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[1]);
      promptsForPlayer3.prompts.push(prompts[2]);
      promptsForPlayers.push(promptsForPlayer3);
      break;
    }
    case 4: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[2]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[1]);
      promptsForPlayer3.prompts.push(prompts[2]);
      promptsForPlayers.push(promptsForPlayer3);
      const promptsForPlayer4 = { player: players[3], prompts: [] };
      promptsForPlayer4.prompts.push(prompts[1]);
      promptsForPlayer4.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer4);
      break;
    }
    case 5: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[1]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[2]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[2]);
      promptsForPlayer3.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer3);
      const promptsForPlayer4 = { player: players[3], prompts: [] };
      promptsForPlayer4.prompts.push(prompts[1]);
      promptsForPlayer4.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer4);
      const promptsForPlayer5 = { player: players[4], prompts: [] };
      promptsForPlayer5.prompts.push(prompts[3]);
      promptsForPlayer5.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer5);
      break;
    }
    case 6: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[1]);
      promptsForPlayer3.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer3);
      const promptsForPlayer4 = { player: players[3], prompts: [] };
      promptsForPlayer4.prompts.push(prompts[1]);
      promptsForPlayer4.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer4);
      const promptsForPlayer5 = { player: players[4], prompts: [] };
      promptsForPlayer5.prompts.push(prompts[2]);
      promptsForPlayer5.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer5);
      const promptsForPlayer6 = { player: players[5], prompts: [] };
      promptsForPlayer6.prompts.push(prompts[2]);
      promptsForPlayer6.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer6);
      break;
    }
    case 7: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[3]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[1]);
      promptsForPlayer3.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer3);
      const promptsForPlayer4 = { player: players[3], prompts: [] };
      promptsForPlayer4.prompts.push(prompts[1]);
      promptsForPlayer4.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer4);
      const promptsForPlayer5 = { player: players[4], prompts: [] };
      promptsForPlayer5.prompts.push(prompts[2]);
      promptsForPlayer5.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer5);
      const promptsForPlayer6 = { player: players[5], prompts: [] };
      promptsForPlayer6.prompts.push(prompts[2]);
      promptsForPlayer6.prompts.push(prompts[6]);
      promptsForPlayers.push(promptsForPlayer6);
      const promptsForPlayer7 = { player: players[6], prompts: [] };
      promptsForPlayer7.prompts.push(prompts[3]);
      promptsForPlayer7.prompts.push(prompts[6]);
      promptsForPlayers.push(promptsForPlayer7);
      break;
    }
    case 8: {
      const promptsForPlayer1 = { player: players[0], prompts: [] };
      promptsForPlayer1.prompts.push(prompts[0]);
      promptsForPlayer1.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer1);
      const promptsForPlayer2 = { player: players[1], prompts: [] };
      promptsForPlayer2.prompts.push(prompts[0]);
      promptsForPlayer2.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer2);
      const promptsForPlayer3 = { player: players[2], prompts: [] };
      promptsForPlayer3.prompts.push(prompts[1]);
      promptsForPlayer3.prompts.push(prompts[5]);
      promptsForPlayers.push(promptsForPlayer3);
      const promptsForPlayer4 = { player: players[3], prompts: [] };
      promptsForPlayer4.prompts.push(prompts[1]);
      promptsForPlayer4.prompts.push(prompts[6]);
      promptsForPlayers.push(promptsForPlayer4);
      const promptsForPlayer5 = { player: players[4], prompts: [] };
      promptsForPlayer5.prompts.push(prompts[2]);
      promptsForPlayer5.prompts.push(prompts[6]);
      promptsForPlayers.push(promptsForPlayer5);
      const promptsForPlayer6 = { player: players[5], prompts: [] };
      promptsForPlayer6.prompts.push(prompts[2]);
      promptsForPlayer6.prompts.push(prompts[7]);
      promptsForPlayers.push(promptsForPlayer6);
      const promptsForPlayer7 = { player: players[6], prompts: [] };
      promptsForPlayer7.prompts.push(prompts[3]);
      promptsForPlayer7.prompts.push(prompts[7]);
      promptsForPlayers.push(promptsForPlayer7);
      const promptsForPlayer8 = { player: players[7], prompts: [] };
      promptsForPlayer8.prompts.push(prompts[3]);
      promptsForPlayer8.prompts.push(prompts[4]);
      promptsForPlayers.push(promptsForPlayer8);
      break;
    }

    default:
      throw new Error("Invalid number of players.  You must have between 3-8 players.");
  }

  return promptsForPlayers;
}