import { Component } from '@angular/core';
import { GeocodingResult } from './models/geocoding-result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-leaflet-geocoding-map';
  results: GeocodingResult[] = [];
  selectedResult: GeocodingResult | null = null;
  hasSearched = false;

  handleResultsFound(results: GeocodingResult[]): void {
    this.results = results;
    this.selectedResult = null;
    this.hasSearched = true;
  }

  handleResultSelected(result: GeocodingResult): void {
    this.selectedResult = result;
  }
}
