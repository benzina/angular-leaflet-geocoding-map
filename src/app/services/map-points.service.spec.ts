import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { MapPointsService } from './map-points.service';

describe('MapPointsService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add a point, update the observable stream and persist to localStorage', done => {
    const service = TestBed.inject(MapPointsService);

    service.addPoint({
      name: 'Paris office',
      latitude: 48.8566,
      longitude: 2.3522
    });

    service.points$.pipe(take(1)).subscribe(points => {
      expect(points.length).toBe(1);
      expect(points[0].name).toBe('Paris office');
      expect(points[0].latitude).toBe(48.8566);
      expect(points[0].longitude).toBe(2.3522);

      const persistedPoints = JSON.parse(localStorage.getItem('angular-leaflet-geocoding-map.points') ?? '[]');
      expect(persistedPoints.length).toBe(1);
      expect(persistedPoints[0].name).toBe('Paris office');
      done();
    });
  });
});
