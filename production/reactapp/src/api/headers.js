import { LocalStorageTools } from "../localStorage";

export default function authHeader() {
    const tokens = LocalStorageTools.getItemFromLocalStorage('tokens');
    if (tokens) {
      return { Authorization: 'Bearer ' + tokens.access };
    } else {
      return { Authorization: '' };
    }
  }