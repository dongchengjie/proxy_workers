import { unzip } from "./extract.js";

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

async function zipCrack(file, dest, dict, concurrency) {
  if (dict && dict.length > 0) {
    let result = null;
    for (let i = 0; i < dict.length; i += concurrency) {
      const tasks = dict.slice(i, i + concurrency).map(async password => {
        return new Promise(resolve =>
          unzip(file, dest, password)
            .then(res => resolve(res))
            .catch(err => resolve(err))
        );
      });
      let results = await Promise.all(tasks)
        .then(res => res)
        .catch(() => {});
      results = results.filter(res => res.flag);
      if (results && results.length > 0) {
        result = results[0].password;
        break;
      }
    }
    return result;
  }
}

export default {
  generatePermutations: generatePermutations,
  numberCrack: numberCrack,
  zipCrack: zipCrack
};