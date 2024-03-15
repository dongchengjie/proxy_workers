const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const lettersLower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const lettersUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function numberCrack(width) {
  return generatePermutations(width, numbers);
}

function generatePermutations(width, characters) {
  const permutations = [];
  generatePermutationsHelper(width, characters, '', permutations);
  return permutations;
}

function generatePermutationsHelper(width, characters, current, permutations) {
  if (current.length === width) {
    permutations.push(current);
    return;
  }
  for (const character of characters) {
    generatePermutationsHelper(width, characters, current + character, permutations);
  }
}
export default {
  generatePermutations: generatePermutations,
  numberCrack: numberCrack
};
