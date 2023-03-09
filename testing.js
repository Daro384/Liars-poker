// function alphabetPosition(text) {
//     let alphabet = "Aabcdefghijklmnopqrstuvwxyz" //adding a space so index of the letters are now shifted by 1
//     alphabet = alphabet.split("")
//     console.log(alphabet.indexOf("a"))
//     text = text.split("").map(char => {
//       if (alphabet.includes(char.toLowerCase())) return alphabet.indexOf(char.toLowerCase())
//     })
//     return text.join(" ");
//   }

// console.log(alphabetPosition("Hello"))