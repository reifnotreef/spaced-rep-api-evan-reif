class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  itemUnshift(item) {
    this.head = new _Node(item, this.head);
  }
  itemPush(item) {
    if (this.head === null) {
      this.itemUnshift(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }
  findId(id) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }

    while (currNode.value.id !== id) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  removeById(id) {
    if (!this.head) {
      return null;
    }
    if (this.head.value.id === id) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value.id !== id) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    previousNode.next = currNode.next;
  }
  remove(item) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }

    if (currNode === null) {
      console.log("Item not found");
      return;
    }

    previousNode.next = currNode.next;
  }
  insertBefore(newItem, nextItem) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === nextItem) {
      this.itemUnshift(newItem);
    }

    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== nextItem) {
      previousNode = currNode;
      currNode = currNode.next;
    }

    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    let newNode = new _Node(newItem, previousNode.next);
    previousNode.next = newNode;
  }
  insertAfter(newItem, prevItem) {
    if (!this.head) {
      return null;
    }
    let currNode = this.head;

    while (currNode !== null && currNode.value !== prevItem) {
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    if (prevItem.next === null) {
      this.itemPush(newItem);
      return;
    }
    let newNode = new _Node(newItem, currNode.next);
    currNode.next = newNode;
  }
  insertAt(newNode, index) {
    if (this.head === null) {
      this.insertFirst(newNode);
    } else {
      let tempNode = this.head;
      let prevNode = this.head;
      let count = 0;
      while (tempNode.next !== null && count < index) {
        count++;
        prevNode = tempNode;
        tempNode = tempNode.next;
      }
      prevNode.next = new _Node(newNode, tempNode);
    }
  }
  display() {
    let currNode = this.head;
    let str = "";
    while (currNode.next !== null) {
      str = str + currNode.value.id + ", ";
      currNode = currNode.next;
    }
    str = str + currNode.value.id;
    return str;
  }
//   display() {
//     let Arr = '[';
//     if (this.head === null) {
//         return Arr + ']'
//     }
//     let tempNode = this.head;
//     while (tempNode.next !== null) {
//         Arr += tempNode.value.correct_count + ', ';
//         tempNode = tempNode.next;
//     }
//     return Arr + tempNode.value.correct_count + ']'
// }
}

module.exports = LinkedList;
