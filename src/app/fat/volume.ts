export class Volume {
    size: number = 0;
    maximumSize: number = 4000000;
    fat: Fat | undefined;
    dft: Dft[] | undefined;

    constructor(size: number) {
        this.size = size * 1000;
        this.fat = new Fat(this.size);
        this.dft = new Array();
    }

    /**
     * Obtiene el espacio que está actualmente en uso
     * @returns El espacio que está en uso
     */
    getSpaceInUse = () => {
        let spaceInUse = 0;
        for (const block of this.fat!.blockList) {
            if (block.status == 1) {
                spaceInUse += block.blockSize;
            }
        }
        return spaceInUse;
    }

}

export class Fat {
    blockSize: number = 209715;
    blockNumber: number = 0;
    volumeSize: number = 0;
    blockList: Block[] = new Array();

    constructor(volumeSize: number) {
        for (let index = 0; index < volumeSize / this.blockSize; index++) {
            this.blockList.push(new Block(index, this.blockSize));
        }
    }
}

export interface Dft {
    id: number;
    fileName: String;
    blockList: Block[];
    size: number;
    creationDate: Date;
    modificationDate: Date;
    extension: String;

}

export class Block {
    id: number = 0;
    status: number = 0;
    blockSize: number = 0;

    constructor(id: number, blockSize: number) {
        this.id = id;
        this.blockSize = blockSize
    }
}