import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeocodingResult } from '../models/geocoding-result.model';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent {
  @Input() results: GeocodingResult[] = [];
  @Input() hasSearched = false;
  @Input() selectedResult: GeocodingResult | null = null;
  @Output() resultSelected = new EventEmitter<GeocodingResult>();
}
