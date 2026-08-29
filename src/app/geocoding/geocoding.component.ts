import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { GeocodingResult } from '../models/geocoding-result.model';

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  importance?: number;
}

@Component({
  selector: 'app-geocoding',
  templateUrl: './geocoding.component.html',
  styleUrls: ['./geocoding.component.scss']
})
export class GeocodingComponent {
  @Output() resultsFound = new EventEmitter<GeocodingResult[]>();

  query = '';
  isLoading = false;
  errorMessage = '';

  constructor(private readonly http: HttpClient) {}

  search(): void {
    const trimmedQuery = this.query.trim();

    if (!trimmedQuery || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('q', trimmedQuery)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', '6');

    this.http.get<NominatimResult[]>('https://nominatim.openstreetmap.org/search', { params })
      .pipe(
        map(results => results.map(result => ({
          displayName: result.display_name,
          latitude: Number(result.lat),
          longitude: Number(result.lon),
          type: result.type,
          importance: result.importance
        }))),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: results => {
          this.resultsFound.emit(results);
          if (results.length === 0) {
            this.errorMessage = 'Aucun resultat trouve pour cette recherche.';
          }
        },
        error: () => {
          this.resultsFound.emit([]);
          this.errorMessage = 'La recherche a echoue. Verifiez votre connexion puis reessayez.';
        }
      });
  }
}
