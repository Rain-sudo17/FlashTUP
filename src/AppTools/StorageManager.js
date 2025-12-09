class StorageManager {
  constructor(key) {
    this.key = key;
  }

  // Helper to ensure we always get a valid array
  getAllSets() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading sets:", e);
      return [];
    }
  }

  // CREATE: Adds a brand new set
  saveSet(set) {
    try {
      const sets = this.getAllSets();
      // Add a timestamp and unique ID if missing
      const newSet = {
        ...set,
        id: set.id || Date.now().toString(),
        lastModified: new Date().toISOString()
      };
      
      sets.push(newSet);
      localStorage.setItem(this.key, JSON.stringify(sets));
      return true;
    } catch (e) {
      console.error("Error saving set:", e);
      return false;
    }
  }

  // UPDATE: Overwrites an existing set at a specific index
  // Critical for saving study progress!
  updateSet(index, updatedSet) {
    try {
      const sets = this.getAllSets();
      
      if (index >= 0 && index < sets.length) {
        sets[index] = {
          ...updatedSet,
          lastModified: new Date().toISOString() // Update timestamp
        };
        localStorage.setItem(this.key, JSON.stringify(sets));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating set:", e);
      return false;
    }
  }
  
  // DELETE: Removes a set
  deleteSet(index) {
    try {
      const sets = this.getAllSets();
      if (index >= 0 && index < sets.length) {
        sets.splice(index, 1);
        localStorage.setItem(this.key, JSON.stringify(sets));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error deleting set:", e);
      return false;
    }
  }
  
  // READ: Get single set
  getSet(index) {
    const sets = this.getAllSets();
    return sets[index] || null;
  }
}

export default StorageManager;