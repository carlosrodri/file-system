import { ExtComponent } from './ext/ext.component';
import { FatComponent } from './fat/fat.component';
import { NtfsComponent } from './ntfs/ntfs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'', component: NtfsComponent
  },
  {
    path:'ntfs', component: NtfsComponent
  }, {
    path:'fat', component: FatComponent
  }, {
    path:'ext', component: ExtComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
