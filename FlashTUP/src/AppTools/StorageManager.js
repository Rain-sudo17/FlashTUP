class StorageManager {
  constructor(key) {
    this.key = key;
  }

  getAllSets() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  saveSet(set) {
    try {
      const sets = this.getAllSets();
      sets.push(set);
      localStorage.setItem(this.key, JSON.stringify(sets));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  
  deleteSet(index) {
    const sets = this.getAllSets();
    sets.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(sets));
    return true;
  }
  
  getSet(index) {
    const sets = this.getAllSets();
    return sets[index];
  }
}

export default StorageManager;