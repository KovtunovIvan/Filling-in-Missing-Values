export class LocalStorageTools {
    static setItemToLocalStorage(name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    }
  
    static getItemFromLocalStorage(name) {
      const item = localStorage.getItem(name);
  
      return item ? JSON.parse(item) : null;
    }

    static removeFromLocalStorage(name) {
        localStorage.removeItem(name);
    }
  }