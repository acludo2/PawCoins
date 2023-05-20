import { Optional } from "./canister";
import { actorController } from "./canister";

export * from "./video";
export * from "./canister";

export const KEY_LOCALSTORAGE_USER = `pawy-user`;

export const MAX_CHUNK_SIZE = 1024 * 500; // 500kb
export const REWARDS_CHECK_INTERVAL = 60000;
export const hashtagRegExp = /(?:\s|^)#[A-Za-z0-9\-._]+(?:\s|$)/gim;

export const actor = actorController;

export const encodeArrayBuffer = (file: ArrayBuffer): number[] =>
  Array.from(new Uint8Array(file));

export function unwrap<T>(val: Optional<T>): T | null {
  if (val[0] === undefined) {
    return null;
  } else {
    return val[0];
  }
}

export function formatBigNumber(number: number): string {
  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(2)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(2)}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }
  return `${number}`;
}

// Converts a file from a byteArray to a blob URL
// TODO: Detect mime-type, "fileToBlobUrl" https://stackoverflow.com/a/29672957
export function fileToImgSrc(file: [] | number[][], imgType = "jpeg"): string {
  const byteArray = new Uint8Array(file[0]);
  const picBlob = new Blob([byteArray], { type: `image/${imgType}` });
  const picSrc = URL.createObjectURL(picBlob);
  return picSrc;
}

// Converts a word into a hex color for placeholder profile pic backgrounds
export function textToColor(text: string): string {
  const numStringFromString = text
    .split("")
    .map((char) => char.charCodeAt(0))
    .join("");
  let hexFromNumString = parseInt(numStringFromString, 10).toString(16);
  const hexLength = hexFromNumString.length;
  const trimAmount = hexLength - 6;

  if (trimAmount < 0) {
    for (let i = 0; i < Math.abs(trimAmount); i++) {
      hexFromNumString += "0";
    }
  }
  if (trimAmount > 1) {
    const startIndex = Math.ceil(trimAmount / 2);
    const hexArray = hexFromNumString.split("");
    const trimmedArray = hexArray.slice(startIndex, startIndex + 6);

    hexFromNumString = trimmedArray.join("");
  }

  return `#${hexFromNumString}`;
}

// Regular expressions for detecting canisterId in various formats
const ic0AppHostRegEx = /(?:(?<canisterId>.*)\.)?(?<subdomain>[^.]*)\.(?<domain>ic0\.app)$/;
const localhostRegEx = /(?<canisterId>(?:\w{5}-){4}cai)\.[^.]*$/;

