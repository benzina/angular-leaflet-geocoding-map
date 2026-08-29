import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { GeocodingComponent } from './geocoding/geocoding.component';
import { MapPointFormComponent } from './map-point-form/map-point-form.component';
import { MapComponent } from './map/map.component';
import { ResultsListComponent } from './results-list/results-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GeocodingComponent,
    ResultsListComponent,
    MapPointFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
