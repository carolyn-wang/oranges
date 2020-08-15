export function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
  
  const prompts = [
      "What is __’s superhero alter-ego?",
      "What is ___’s greatest fear?",
      "What does __ do in their free time?",
      //'What is {$players.pop()}’s best personality trait?'
  ];