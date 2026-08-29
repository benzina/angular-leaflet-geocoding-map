import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapPoint } from '../models/map-point.model';

const STORAGE_KEY = 'angular-leaflet-geocoding-map.points';

@Injectable({
  providedIn: 'root'
})
export class MapPointsService {
  private readonly pointsSubject = new BehaviorSubject<MapPoint[]>(this.loadPoints());

  readonly points$: Observable<MapPoint[]> = this.pointsSubject.asObservable();

  addPoint(point: Omit<MapPoint, 'id'>): MapPoint {
    const savedPoint: MapPoint = {
      ...point,
      id: this.createId()
    };
    const nextPoints = [...this.pointsSubject.value, savedPoint];
    this.pointsSubject.next(nextPoints);
    this.persistPoints(nextPoints);

    return savedPoint;
  }

  private loadPoints(): MapPoint[] {
    const rawPoints = localStorage.getItem(STORAGE_KEY);

    if (!rawPoints) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawPoints) as MapPoint[];
      return Array.isArray(parsed) ? parsed.filter(point => this.isValidPoint(point)) : [];
    } catch {
      return [];
    }
  }

  private persistPoints(points: MapPoint[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
  }

  private isValidPoint(point: Partial<MapPoint>): point is MapPoint {
    return typeof point.id === 'string'
      && typeof point.name === 'string'
      && typeof point.latitude === 'number'
      && typeof point.longitude === 'number'
      && point.latitude >= -90
      && point.latitude <= 90
      && point.longitude >= -180
      && point.longitude <= 180;
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
