/**
 * Meteora Hacker House roster for UBC 2026. Position in this list is the
 * ticket number (first name is 001), so append new people at the end:
 * reordering changes numbers people have already posted.
 */
export const ROSTER = [
  'Yash Bapat',
  'Vishal Pentela',
  'Aditya Kuniyil Kattil',
  'Jazib Qureshi',
  'Srijan Challapalli',
  'Vatsal Maheshwari',
  'Muhammad Ayaan Ameen',
  'Jayden Liu',
  'Aditya Mallepalli',
  'Mahathi Kuppireddy',
  'Vaibhav Sunkada',
  'Manasvi Meka',
  'Aditya Chaudhary',
  'Archisha Chennur',
  'Keval Shah',
  'Bryan Ren',
  'Aryan Patel',
  'Ishaan Saxena',
  'Monish Malla',
  'Esha Bapat',
  'Rithvik Reddy Siddenki',
  'Artem Kolomiets',
  'Ishan Ghosh',
  'Areeb Islam',
  'Pranav Doshi',
  'Siya Jariwala',
  'Neena Naikar',
  'Joey Kokinda',
  'Akash Mishra',
  'Mugdha Patil',
  'Nick Diaz',
  'Eli Dubizh',
  'Garv Tayade',
  'Christopher Herzog',
  'Anubhuti Mittal',
  'Oscar Velasco',
  'Jay Kohut',
  'Nikhil Madakasira',
  'Sid Songirkar',
];

const nameTokens = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

const ROSTER_TOKENS = ROSTER.map(nameTokens);

/**
 * Reserved ticket number (1-based) for a typed name, or null.
 *
 * Needs at least two name parts that all belong to exactly one roster entry,
 * so "Ayaan Ameen" finds "Muhammad Ayaan Ameen" but "Aditya" alone (three of
 * them) finds nobody.
 */
export function reservedNumber(typedName) {
  const typed = nameTokens(typedName);
  if (typed.length < 2) return null;
  const matches = ROSTER_TOKENS.flatMap((tokens, index) =>
    typed.every((token) => tokens.includes(token)) ? [index + 1] : [],
  );
  return matches.length === 1 ? matches[0] : null;
}
