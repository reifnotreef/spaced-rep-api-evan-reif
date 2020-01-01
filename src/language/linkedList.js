class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // at to front
  shiftItem(data) {
    this.head = new Node(data, this.head);
    this.size++;
  }

  // add to back
  pushItem(data) {
    const node = new Node(data);
    let last = null;
    if (!this.head) {
      this.head = node;
    } else {
      last = this.head;
      while (last.next) {
        last = last.next;
      }
      tail.next = node;
    }
    this.size++;
  }

  // insert at index
  insertAt(data, index) {
    if (!this.head) {
      this.head = new Node(data);
      return;
    }
    if (index === 0) {
      this.shiftItem(data);
      return;
    }
    let node = new Node(data);
    let count = 0,
      current = this.head,
      previous;
    while (count < index) {
      previous = current;
      count++;
      current = current.next;
    }
    node.next = current;
    previous.next = node;
    this.size++;
  }

  // insert 1 index after target
  insertAfter(value, index) {
    index + 1 > this.size
      ? this.pushItem(value)
      : this.insertAt(value, index + 1);
  }

  // insert 1 index before target
  insertBefore(value, index) {
    index - 1 > 0 ? this.insertAt(value, index - 1) : this.pushItem(value);
  }

  find(value) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.data !== value) {
      currNode.next === null ? null : (currNode = currNode.next);
    }
    return currNode;
  }

  findPrevious(value) {
    let currNode = this.head;
    if (currNode === null) {
      return "empty list";
    } else {
      let tempNode = currNode;
      while (currNode.data !== value) {
        if (currNode.next === null) {
          return "no such value";
        } else {
          tempNode = currNode;
          currNode = currNode.next;
        }
      }
      return tempNode;
    }
  }

  // Not sure if this will work properly tbh
  // but it looks real nice!
  remove(item) {
    let prev = this.findPrevious(item);
    let target = this.find(item);
    prev.next = target.next;
  }
  // if (!this.head) {
  //   return null;
  // }
  // if (this.head.data === item) {
  //   this.head = this.head.next;
  //   return;
  // }
  // let currNode = this.head;
  // let previousNode = this.head;
  // while (currNode !== null && currNode.data !== item) {
  //   previousNode = currNode;
  //   currNode = currNode.next;
  // }
  // if (currNode === null) {
  //   return;
  // }
  // previousNode.next = currNode.next;

  display() {
    let currNode = this.head;
    let str = "";
    while (currNode.next !== null) {
      str = str + currNode.data + ", ";
      currNode = currNode.next;
    }
    return str;
  }

  isEmpty() {
    return this.size === 0;
  }

  findLast() {
    let currNode = this.head;
    if (currNode === null) {
      return "empty list";
    } else {
      while (currNode.next !== null) {
        currNode = currNode.next;
      }
      return currNode;
    }
  }
}

module.exports = LinkedList;
