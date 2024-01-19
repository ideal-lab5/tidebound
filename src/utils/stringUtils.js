// split the input to get the first x characters and the last y characters 
// e.g. abbreviate("abcd", [1, 2]) = "a..d"
export default function abbreviate(input, x, y) {
    return input.slice(0, x) + '...' + input.slice(y);
}