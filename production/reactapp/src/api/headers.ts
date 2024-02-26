import { LocalStorageTools } from "../localStorage";
import { Token } from "../types";

export default function authHeader() {
    const tokens = LocalStorageTools.getItemFromLocalStorage<Token>('tokens');
    if (tokens) {
      return { Authorization: 'Bearer ' + tokens.access };
    } else {
      return { Authorization: '' };
    }
  }