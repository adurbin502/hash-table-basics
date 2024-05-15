const sha256 = require("js-sha256");

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  constructor(numBuckets = 4) {
    this.count = 0;
    this.capacity = numBuckets;
    this.data = new Array(this.capacity).fill(null);
  }

  hash(key) {
    const hashValue = sha256(key).substring(0, 8);
    return parseInt(hashValue, 16);
  }

  hashMod(key) {
    return this.hash(key) % this.capacity;
  }

  insertNoCollisions(key, value) {
    const index = this.hashMod(key);

    if (this.data[index] === null) {
      this.data[index] = new KeyValuePair(key, value);
      this.count++;
    } else {
      throw new Error(
        "hash collision or same key/value pair already exists!"
      );
    }
  }

  insertWithHashCollisions(key, value) {
    const index = this.hashMod(key);

    let newPair = new KeyValuePair(key, value);

    if (!this.data[index]) {
      this.data[index] = newPair;
    } else {
      newPair.next = this.data[index];
      this.data[index] = newPair;
    }
    this.count++;
  }

  insert(key, value) {
    const index = this.hashMod(key);

    // Check if the bucket is empty
    if (this.data[index] === null) {
      // If the bucket is empty, create a new KeyValuePair
      this.data[index] = new KeyValuePair(key, value);
    } else {
      // If the bucket is not empty, handle collision by chaining elements in a linked list
      let current = this.data[index];
      while (current !== null) {
        if (current.key === key) {
          // If the same key already exists, update the value
          current.value = value;
          return; // Exit the function after updating the value
        }
        // Move to the next node in the linked list
        current = current.next;
      }
      // If the key doesn't exist in the linked list, insert a new KeyValuePair at the head
      const newPair = new KeyValuePair(key, value);
      newPair.next = this.data[index];
      this.data[index] = newPair;
    }

    this.count++;
  }
}

module.exports = HashTable;
