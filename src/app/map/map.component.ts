import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { icon, latLng, Map, MapOptions, Marker, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { GeocodingResult } from '../models/geocoding-result.model';
import { MapPoint } from '../models/map-point.model';
import { MapPointsService } from '../services/map-points.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() set selectedResult(result: GeocodingResult | null) {
    this.currentSelectedResult = result;

    if (result && this.map) {
      this.focusResult(result);
    }
  }

  map!: Map;
  mapOptions!: MapOptions;

  private currentSelectedResult: GeocodingResult | null = null;
  private pointsSubscription?: Subscription;
  private savedMarkers: Marker[] = [];
  private selectedMarker?: Marker;
  private readonly markerIcon = icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    iconUrl: 'assets/marker-icon.png'
  });

  constructor(private readonly mapPointsService: MapPointsService) { }

  ngOnInit(): void {
    this.initializeMapOptions();
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.pointsSubscription = this.mapPointsService.points$.subscribe(points => {
      this.renderSavedMarkers(points);
    });

    if (this.currentSelectedResult) {
      this.focusResult(this.currentSelectedResult);
    }
  }

  ngOnDestroy(): void {
    this.pointsSubscription?.unsubscribe();
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(51.505, 0),
      zoom: 12,
      layers: [
        tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data (c) OpenStreetMap contributors'
          })
      ],
    };
  }

  private focusResult(result: GeocodingResult): void {
    const position = latLng(result.latitude, result.longitude);
    this.map.setView(position, 14);

    if (this.selectedMarker) {
      this.selectedMarker.removeFrom(this.map);
    }

    this.selectedMarker = new Marker(position)
      .setIcon(this.markerIcon)
      .bindPopup(result.displayName)
      .addTo(this.map);
  }

  private renderSavedMarkers(points: MapPoint[]): void {
    this.savedMarkers.forEach(marker => marker.removeFrom(this.map));
    this.savedMarkers = points.map(point => new Marker([point.latitude, point.longitude])
      .setIcon(this.markerIcon)
      .bindPopup(`<strong>${this.escapeHtml(point.name)}</strong><br>${point.latitude}, ${point.longitude}`)
      .addTo(this.map));
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
