'use strict';

// From: https://github.com/grempe/diceware/blob/master/index.js
// License: MIT
// See: https://www.reddit.com/r/crypto/comments/4xe21s/
//
// skip is to make result in this range:
// 0 ≤ result < n* count < 2^31
// (where n is the largest integer that satisfies this equation)
// This makes result % count evenly distributed.
//
// P.S. if (((count - 1) & count) === 0) {...} is optional and for
// when count is a nice binary number (2n). If this if statement is
// removed then it might have to loop a few times. So it saves a
// couple of micro seconds.
function secureRandom (count) {
    var cryptoObj = window.crypto || window.msCrypto;
    var rand = new Uint32Array(1);
    var skip = 0x7fffffff - 0x7fffffff % count;
    var result;
  
    if (((count - 1) & count) === 0) {
      cryptoObj.getRandomValues(rand);
      return rand[0] & (count - 1);
    }
  
    do {
      cryptoObj.getRandomValues(rand);
      result = rand[0] & 0x7fffffff;
    } while (result >= skip);
  
    return result % count;
}
  
// From: https://github.com/grempe/diceware/blob/master/index.js
// License: MIT
// Returns an array of objects of length numWords (default 1).
// Each object in the array represents a word and its index
// and is the result of numRollsPerWord die rolls (default 5).
function getWords (numWords, numRollsPerWord) {
    var i,
        j,
        words,
        rollResults,
        rollResultsJoined;
  
    words = [];
  
    if (!numWords) { numWords = 1 }
    if (!numRollsPerWord) { numRollsPerWord = 5 }
  
    for (i = 0; i < numWords; i += 1) {
      rollResults = [];
  
      for (j = 0; j < numRollsPerWord; j += 1) {
        // roll a 6 sided die
        rollResults.push(secureRandom(6) + 1);
      }
  
      rollResultsJoined = rollResults.join('');
      words.push(eff[rollResultsJoined]);
    }
  
    return words;
}

// generate 8 x 5-dice words from the eff word list and save
// them into the txtPassword input field, and select the text
// to make copying to the clipboard easier
function generate() {
    $("#password").val(getWords(8,5).join('-')).select();
}

$(document).ready(function () {
    generate();
});

$("#password").click(function () {
    this.select();
});

$("#generate").click(function () {
    generate();
    return false;
});