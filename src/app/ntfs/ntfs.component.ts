import { Component, OnInit } from '@angular/core';
import { Volume } from './volume'

@Component({
  selector: 'app-ntfs',
  templateUrl: './ntfs.component.html',
  styleUrls: ['./ntfs.component.css']
})
export class NtfsComponent implements OnInit {

  volume: Volume;

  constructor() {
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AQUÍ CREAMOS EL VOLUMEN INICIAL<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.volume = new Volume(4096);


        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AQUÍ AGREGAMOS LOS ARCHIVOS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    this.volume.addFile('sample', 500, 'docx');
    setTimeout(() => {
      this.volume.addFile('sample2', 700, 'docx');
      this.volume.assignPhisicalSpace();
    }, 2000);
  }

  ngOnInit(): void {
    for (const group of this.volume.getGroupList()) {
      let fileSystem = document.getElementById('file-system');
      let groupHtml = document.createElement('div');
      groupHtml.className = 'group';
      groupHtml.style.border = 'solid'
      groupHtml.style.borderWidth = '1px';
      groupHtml.style.display = 'flex';
      groupHtml.style.height = '30px';
      fileSystem?.appendChild(groupHtml)
      for (const sector of group.sectorList) {
        let sectorHtml = document.createElement('div');

        sectorHtml.id = `${sector.id}`;
        sectorHtml.innerHTML = `${sector.status}`;
        sectorHtml.style.textAlign = 'center'
        sectorHtml.className = 'sector';
        sectorHtml.style.borderRight = 'dotted'
        sectorHtml.style.width = '50%'
        sectorHtml.style.borderColor = (sector.status == 0) ? 'tomato' : '#ffff';
        sectorHtml.style.borderWidth = '1px';
        sectorHtml.style.color = (sector.status == 0) ? 'black' : '#ffff';
        sectorHtml.style.backgroundColor = (sector.status == 0) ? '#ffff' : 'tomato';

        groupHtml.appendChild(sectorHtml);
      }
    }
    document.getElementById('free-space')!.style.width = `${this.toPercentage(this.getFreeSpace())}%`;
    document.getElementById('use-space')!.style.width = `${this.toPercentage(this.volume.getSpaceInUse())}%`;

    this.volume.assignPhisicalSpace();
  }

  toGB = (capacity: number) => {
    return Math.round(capacity / 1024 * 100) / 100;
  }

  toPercentage = (size: number) => {
    const percentage = (Math.round((size / this.volume.size) * 100) / 100) * 100;
    return percentage;
  }

  getFreeSpace = () => {
    return this.volume.getSize() - this.volume.getSpaceInUse();
  }

}
