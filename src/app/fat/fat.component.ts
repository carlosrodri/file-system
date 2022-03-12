import { Component, OnInit } from '@angular/core';
import { Volume, Block } from './volume';

@Component({
  selector: 'app-fat',
  templateUrl: './fat.component.html',
  styleUrls: ['./fat.component.css']
})
export class FatComponent implements OnInit {

  volume: Volume | undefined;

  constructor() {
    // >>>>>>>>>>>>>>>>>>>>>>>>AQUI CREAMOS EL VOLUMEN INICIAL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.volume = new Volume(2048);
  }

  ngOnInit(): void {
    // Esto es un Método de pintado
    for (const block of this.volume!.fat!.blockList) {
      let fileSystem = document.getElementById('file-system');
      let groupHtml = document.createElement('div');
      groupHtml.className = 'group';
      groupHtml.style.border = 'solid'
      groupHtml.style.borderWidth = '1px';
      groupHtml.style.display = 'flex';
      groupHtml.style.height = '30px';
      groupHtml.innerHTML = `${block.id}`
      groupHtml.id = `block-${block.id}`

      let statusHtml = document.createElement('p');
      statusHtml.id = `${block.id}`
      statusHtml.style.marginLeft = '32%'
      statusHtml.textContent = `${block.status}`;

      let nextHtml = document.createElement('p');
      nextHtml.id = `next-${block.id}`
      nextHtml.style.marginLeft = '32%'
      nextHtml.textContent = '0';

      groupHtml.appendChild(statusHtml)
      groupHtml.appendChild(nextHtml)
      fileSystem?.appendChild(groupHtml)
    }

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AQUÍ AGREGAMOS EL ARCHIVO<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.addFile(fileId, 'sampleFAT', 1000, 'txt')


    fileId++;
    document.getElementById('free-space')!.style.width = `${this.toPercentage(this.getFreeSpace())}%`;
    document.getElementById('use-space')!.style.width = `${this.toPercentage(this.volume!.getSpaceInUse())}%`;
  }

  /**
   * Agrega un archivo dependiendo si hay o no espacio libre, si lo hay, asigna la data a los espacios en memoria y agrega a la dft
   * Al asignar el espacio, también se asignan los bloques en los cuales se asignan la data del archivo y se guarda el Nodo cabeza que es en
   * donde inicia la data de ese archivo y en cada bloque se asigna su apuntador a siguiente (como una lista simplemente enlazada) y para determinar 
   * el final del archivo, el apuntador a siguiente del nodo, queda en (-1)
   * @param id Id del archivo
   * @param fileName Nombre del archivo
   * @param size Tamaño del archivo
   * @param extension Extensión del archivo
   */
  public addFile = (id: number, fileName: String, size: number, extension: string) => {
    let blockList: Block[] = new Array;
    let letfSize = size*1000;
    for (const block of this.volume!.fat!.blockList) {
      if (block.status == 0 && letfSize >= block.blockSize) {
        letfSize -= block.blockSize;
        block.status = 1;
        blockList.push(block);
      }
    }
    this.volume!.dft!.push({ id, fileName, blockList, size, creationDate: new Date(), modificationDate: new Date(), extension});

    //Esto es un método de pintado
    for (let index = 0; index < blockList.length; index++) {
      console.log(index+1, blockList.length)
      if (index+1 < blockList.length) {
        let htmlElement =  document.getElementById(`next-${blockList[index].id}`)
        htmlElement!.innerHTML =  `${blockList[index+1].id}`
        htmlElement!.style.color = '#ffff'
        document.getElementById(`block-${blockList[index].id}`)!.style.backgroundColor = 'tomato'
        document.getElementById(`${blockList[index].id}`)!.textContent = `${blockList[index].status}`
      } else {
        let htmlElement = document.getElementById(`next-${blockList[index].id}`)
        htmlElement!.innerHTML =  `-1`
        htmlElement!.style.color = '#ffff'
        document.getElementById(`block-${blockList[index].id}`)!.style.backgroundColor = 'tomato'
        document.getElementById(`${blockList[index].id}`)!.textContent = `${blockList[index].status}`
      }
    }
  }

  /**
   * Obtiene el espacio libre en el sistema de archivos
   * @returns Esoacio libre
   */
  getFreeSpace = () => {
    return this.volume!.size - this.volume!.getSpaceInUse();
  }

  toGB = (capacity: number) => {
    return (Math.round(capacity / 1024 * 100)) /100000;
  }

  toPercentage = (size: number) => {
    const percentage = (Math.round((size / this.volume!.size) * 100) / 100) * 100;
    return percentage;
  }

}

let fileId: number = 0

