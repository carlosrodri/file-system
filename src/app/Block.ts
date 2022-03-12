class Block {
    capacity: Number = 0;
    next: Block | undefined ;

    constructor(capacity: Number, next: Block) {
        this.capacity = capacity;
        this.next = next;
    }
}