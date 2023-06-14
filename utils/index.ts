export type Replace<T, R> = Omit<T, keyof R> & R;

export function incrementShort(value: string): string {
  const numberPart = value.match(/\d+/)?.[0];
  let letter = value.match(/[a-zA-Z]+/)?.[0];

  if (!letter || !numberPart) {
    throw new Error("Invalid short");
  }

  let number = parseInt(numberPart);

  if (letter === "z") {
    number++;
    letter = "a";
  } else {
    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  return number + letter;
}

export function getUrlRoot(url: string): string {
  const parsedUrl = new URL(url);
  const rootUrl = parsedUrl.protocol + "//" + parsedUrl.hostname;
  return rootUrl;
}
