export function parseNumber(string) {
    // Remove commas from the string using the replace method
    const stringWithoutCommas = string.replace(/,/g, "");
    // Convert the string without commas to a number
    const number = parseFloat(stringWithoutCommas);
    return number;
}
