import { AccessType } from './../ntfs/volume';
export class Volume {
    size: number = 0;
    name: String = '';
    blockList: Block[] = new Array();
    inodeList: Inode[] = new Array();

    constructor(size: number, name: String) {
        let blockId = 0;
        this.name = name;
        const blockSize = 4;
        this.size = size;
        for (let index = 0; index < size / blockSize; index++) {
            this.blockList.push({ id: blockId++, size: blockSize, status: 0 })
        }
    }

    /**
     * Agrear un archivo a una estructura de INodo siempre y cuando se cuente con espacio disponible.
     * Si cuenta con espacio disponible, se procede a cambiar los estados de los bloques y asignar los apuntadores a los bloques de memoria del INodo actual
     * Si el archivo esta "contenido" dentro de un directorio, a ese directorio padre se le agrega la referencia del INodo actual (hijo)
     * o el apuntador indirecto
     * @param fileName Nombre del archivo
     * @param size Tamaño del archivo
     * @param extension Extensión ddel archivo
     * @param fatherId Referencia del INodo padre (si tiene, si no es  -1)
     */
    addFile = (fileName: String, size: number, extension: String, fatherId: number | undefined) => {
        let leftSzie = size;
        if (this.getFreeSpace() >= size) {
            let INode = new Inode(this.inodeId++, fileName, extension, 'Admin', AccessType.ReadAndWrite, size, fatherId)
            this.inodeList.push(INode)
            for (const block of this.blockList) {
                if (block.status == 0 && leftSzie > 0) {
                    leftSzie -= block.size;
                    block.status = 1;
                    INode.addPointer(block)
                }
            }
            if (fatherId) {
                this.inodeList.find(iNode => iNode.id == fatherId)?.addChild(INode)
            }
        }
    }

    /**
     * Éste método recursivo obtiene la ruta del nodo en cuestion hasta la mayor jerarquía posible, que es la que tiene como apuntador de INodo padre (-1)
     * @param inode INode actual a ser evaluado
     * @param currentPath Ruta que se llevga hasta el momento
     * @param volumeName Nombre del volumen o archivo principal
     * @returns Ruta del archivo en cuestión
     */
    getPath = (inode: Inode, currentPath: String, volumeName: String): any => {
        if(currentPath == '' && inode.fatherId! == -1){
            return `${volumeName}/${inode.fileName}`
        }else{
            if (inode.fatherId! == -1) {
                currentPath = `${volumeName}${currentPath}`
                return currentPath;
            } else {
                let father = this.inodeList.find(node => node.id == inode.fatherId)
                return this.getPath(father!, `/${inode.fileName}${currentPath}`, volumeName)
            }
        }
    }

    /**
     * Obtiene el espacio libre en el sistema de archivos
     * @returns Esoacio libre
     */
    getFreeSpace = () => {
        let availableSize = 0;
        for (const block of this.blockList) {
            if (block.status == 0) {
                availableSize += block.size;
            }
        }
        return availableSize;
    }

    /**
     * Obtiene el espacio en uso en el sistema de archivos
     * @returns Espacio en uso
     */
    getSpaceInUse = () => {
        let usedSpace = 0;
        for (const block of this.blockList) {
            if (block.status == 1) {
                usedSpace += block.size;
            }
        }
        return usedSpace;
    }

    inodeId = 0;
}

export interface Block {
    id: number;
    size: number;
    status: number;
}

export class Inode {
    id: number = 0;
    fileName: String = '';
    extension: String = '';
    own: String = '';
    access: AccessType | undefined;
    path: String = '';
    size: number = 0;
    pointerList: Block[] = new Array();
    inodeList: Inode[] = new Array();
    creationDate: Date = new Date();
    modificationDate: Date = new Date();
    fatherId: number | undefined;

    constructor(id: number, fileName: String, extension: String, own: String, access: AccessType, size: number, fatherId = -1) {
        this.id = id;
        this.fileName = fileName;
        this.extension = extension;
        this.own = own;
        this.access = access;
        this.size = size;
        this.fatherId = fatherId;
    }

    /**
     * 
     * @param pointer Referencia del bloque o apuntador directo de información
     */
    addPointer = (pointer: Block) => {
        this.pointerList.push(pointer);
    }

    /**
     * Agrega las referencia de INodos si llegase a tener
     * @param child INodo hijo (si llega a tener)
     */
    addChild = (child: Inode) => {
        this.inodeList.push(child);
    }

    /**
     * Obtiene la referencia del nodo padre
     * @returns ID del padre (si lo tiene lo retorna, si no, retorna -1)
     */
    getFather = () => {
        return this.fatherId;
    }

    /**
     * Obtiene la referencia de los apuntadores a los bloques de memoria
     * @returns una secuancia de referencia a los bloques de la memoria donde se almacena la data
     */
    getLocation = () => {
        let location = ''
        for (const block of this.pointerList) {
            location += block.id + '-'
        }
        return location.slice(0, location.length-1)
    }
}