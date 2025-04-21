export interface Question {
  id: number;
  text: string;
  answer: string;
  hint?: string;
}

// Initial set of Matrix-themed questions
export const QUESTIONS: Question[] = [
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
