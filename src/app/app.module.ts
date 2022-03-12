import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FatComponent } from './fat/fat.component';
import { NtfsComponent } from './ntfs/ntfs.component';
import { ExtComponent } from './ext/ext.component';

@NgModule({
  declarations: [
    AppComponent,
    FatComponent,
    NtfsComponent,
    ExtComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
