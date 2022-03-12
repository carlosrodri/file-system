export class Volume {
    size: number = 0;
    group: Group[] = new Array();
    mft: Mft[] = new Array();
    id: number = 0;
    sectorCurrentsed: number[] = []

    constructor(size: number) {
        this.size = size;
        createGroup(this.size, this.group);
    }

    getSize = () => {
        return this.size;
    }

    /**
     * Obtiene la cantidad de agrupaciones hechas basado en el total del volumen
     * @returns Cantidad de agrupaciones
     */
    getGroupNumber = () => {
        return this.group.length;
    }

    getGroupList = () => {
        return this.group;
    }

    /**
     * Verifica espacio disponilbe, si lo hay se ocupon los bloques de la memoria y se cambia el estado de cero a uno, luego se agrega el archivo a la mft
     * @param fileName Nombre del archivo
     * @param size Tamaño de archivo
     * @param extension Extensión de archivo
     */
    addFile = (fileName: string, size: number, extension: String) => {
        this.id ++;
        for (const group of this.getGroupList()) {
            console.log(group.isAvailable())
            if(group.isAvailable()){
                let leftSize = size*5;
                for (const sector of group.sectorList) {
                    if(leftSize > 0){
                        sector.status = 1;
                        leftSize -= sector.size;
                        this.sectorCurrentsed.push(sector.id)
                    }else{
                        this.mft.push({id: this.id, access: AccessType.Read, fileName: fileName, own: 'Admin',
                        data: `${this.sectorCurrentsed[0]} - ${this.sectorCurrentsed.slice(-1)[0] }`,
                          size, root: '', volumeInformation: '', creationDate: new Date(), modificationDate: new Date(), extension })
                        return
                    }
                }
            }
        }
    }

    /**
     * Pintar el espacio en uso y el libre
     */
    assignPhisicalSpace = ()=>{
        for (const sector of this.sectorCurrentsed) {
            document.getElementById(`${sector}`)!.style.background = 'tomato'
            document.getElementById(`${sector}`)!.style.borderRight = 'doted'
            document.getElementById(`${sector}`)!.style.borderRightColor = '#ffff'
            document.getElementById(`${sector}`)!.innerHTML = '1'
            document.getElementById(`${sector}`)!.style.color = '#ffff'
        }
        this.sectorCurrentsed = [];
    }

    /**
     * Obtiene el espacio en uso
     * @returns El espacio que está ocupado
     */
    getSpaceInUse = () => {
        let count = 0;
        for (const mft of this.mft) {
           count += mft.size;
        }
        return count;
    }
}

interface Mft {
    id: number;
    access: AccessType;
    fileName: String;
    own: String;
    data: String;
    size: number;
    root: String;
    volumeInformation: String;
    creationDate: Date;
    modificationDate: Date;
    extension: String;
}

interface Sector{
    id: number;
    status: number;
    size: number;
}

export class Group {
    private numberOfSector: number = 0;
    private sizeOfSector: number = 512;
    sectorList: Sector[] = new Array();

    constructor(numberOfSector: number) {
        this.numberOfSector = numberOfSector;
        for (let index = 0; index < this.numberOfSector; index++) {
            this.sectorList.push( {id: sectorId, status: 0, size: this.sizeOfSector} )
            sectorId ++;
        }
    }

    getSize = () => {
        return this.numberOfSector * this.sizeOfSector;
    }

    getSizeOfSector = () =>{
        return this.numberOfSector;
    }

    getNumberOfSector = () =>{
        return this.numberOfSector;
    }

    /**
     * Obtiene información sobre una agrupacion (si está o no completamente libre), está completamente libre si todos sus sectores están libres,
     * de lo contrario no
     * @returns si una agrupación está disponible
     */
    isAvailable = () => {
        let isAvailable = true;
        for (const sector of this.sectorList) {
            if (sector.status == 1) {
                isAvailable = false;
                return isAvailable;
            }
        }
        return isAvailable;
    }
}

export enum AccessType {
    Read = 'Read',
    write = 'Write',
    ReadAndWrite = 'Read and Write'
}

/**
 * Dependiendo de la capacidad del volumen se crea determinada cantidad de agrupaciones y cada agrupación con un 
 * determinado número de sectores de la siguiente manera: £ 512 Mbytes 1 512 bytes
512 Mbytes - 1 Gbyte     2 Sectores por agrupacion   1K    Tamaño de sector
1 Gbyte – 2   Gbytes     4 Sectores por agrupacion   2K    Tamaño de sector
2 Gbytes – 4 Gbytes      8 Sectores por agrupacion   4K    Tamaño de sector
4 Gbytes – 8 Gbytes     16 Sectores por agrupacion   8K    Tamaño de sector
8 Gbytes – 16 Gbytes    32 Sectores por agrupacion   16K   Tamaño de sector
16 Gbytes – 32 Gbytes   64 Sectores por agrupacion   32K   Tamaño de sector
> 32 Gbytes 128 64K
 * @param volumeSize Capacidad del Volumen
 * @param groupList lista de agrupaciones
 */
const createGroup = (volumeSize: number, groupList: Group[]) => {
    const sizeOfSector: number = 512;
    const scaleMultiplicator = 10;
    switch (true) {
        case (volumeSize > 0 && volumeSize <= sizeOfSector):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 0))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 0)));
            }
            break;
        case (volumeSize > sizeOfSector && volumeSize <= (sizeOfSector * 2)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 1))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 1)));
            }
            break;
        case (volumeSize > (sizeOfSector * 2) && volumeSize <= (sizeOfSector * 4)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 2))) * scaleMultiplicator; index++) {
                console.log(index)
                groupList.push(new Group(Math.pow(2, 2)));
            }
            break;
        case (volumeSize > (sizeOfSector * 4) && volumeSize <= (sizeOfSector * 8)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 3))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 3)));
            }
            break;
        case (volumeSize > (sizeOfSector * 8) && volumeSize <= (sizeOfSector * 16)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 4))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 4)));
            }
            break;
        case (volumeSize > (sizeOfSector * 16) && (volumeSize <= sizeOfSector * 32)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 5))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 5)));
            }
            break;
        case (volumeSize > (sizeOfSector * 32)):
            for (let index = 0; index < (volumeSize / (sizeOfSector * Math.pow(2, 6))) * scaleMultiplicator; index++) {
                groupList.push(new Group(Math.pow(2, 6)));
            }
            break;

    }
}

let sectorId = 0;