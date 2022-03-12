import { Volume } from './volume';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ext',
  templateUrl: './ext.component.html',
  styleUrls: ['./ext.component.css']
})
export class ExtComponent implements OnInit {

  volume: Volume | undefined;

  constructor() { 
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AQUÍ CREAMOS EL VOLUMEN INICIAL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.volume = new Volume(2048,'Computer');

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AQUÍ AGREGAMOS LOS ARCHIVOS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.volume!.addFile('Folder', 1, 'json', -1);
    this.volume!.addFile('Sample', 46, 'json', 0);
    this.volume!.addFile('Sample1', 46, 'json', 1);
  }

  ngOnInit(): void {
    // Este es un método de pintado
    for (const block of this.volume!.blockList) {
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
      statusHtml.style.marginLeft = '48%';
      statusHtml.textContent = `${block.status}`;

      groupHtml.appendChild(statusHtml)
      fileSystem?.appendChild(groupHtml)
    }

    this.paintFisicalSpace();

    document.getElementById('free-space')!.style.width = `${this.toPercentage(this.volume!.getFreeSpace())}%`;
    document.getElementById('use-space')!.style.width = `${this.toPercentage(this.volume!.getSpaceInUse())}%`;
  }

//Este es un método de pintado
  paintFisicalSpace = () => {
    for (let index = 0; index < this.volume!.blockList.length; index++) {
      document.getElementById(`block-${this.volume!.blockList[index].id}`)!.style.color = '#ffff'
      if(this.volume!.blockList[index].status == 1){
        document.getElementById(`block-${this.volume!.blockList[index].id}`)!.style.backgroundColor = 'tomato'
      }else{
        document.getElementById(`block-${this.volume!.blockList[index].id}`)!.style.backgroundColor = '#0D6EFD'
      }
    }
  }

  toGB = (capacity: number) => {
    return (Math.round(capacity / 1024 * 100))/100;
  }

  toPercentage = (size: number) => {
    const percentage = (Math.round((size / this.volume!.size) * 100) / 100) * 100;
    return percentage;
  }

}
