import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GeocodingComponent } from './geocoding.component';

describe('GeocodingComponent', () => {
  let component: GeocodingComponent;
  let fixture: ComponentFixture<GeocodingComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeocodingComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GeocodingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should emit normalized results after a successful search', () => {
    const emittedResults = jasmine.createSpy('emittedResults');
    component.resultsFound.subscribe(emittedResults);
    component.query = 'Paris';

    component.search();

    const request = httpMock.expectOne(req =>
      req.url === 'https://nominatim.openstreetmap.org/search'
        && req.params.get('q') === 'Paris'
        && req.params.get('format') === 'json'
        && req.params.get('limit') === '6');

    request.flush([
      {
        display_name: 'Paris, Ile-de-France, France',
        lat: '48.8566',
        lon: '2.3522',
        type: 'city',
        importance: 0.9
      }
    ]);

    expect(emittedResults).toHaveBeenCalledWith([
      {
        displayName: 'Paris, Ile-de-France, France',
        latitude: 48.8566,
        longitude: 2.3522,
        type: 'city',
        importance: 0.9
      }
    ]);
    expect(component.errorMessage).toBe('');
    expect(component.isLoading).toBeFalse();
  });

  it('should show an empty state message when no result is returned', () => {
    const emittedResults = jasmine.createSpy('emittedResults');
    component.resultsFound.subscribe(emittedResults);
    component.query = 'no-such-place';

    component.search();
    httpMock.expectOne(req =>
      req.url === 'https://nominatim.openstreetmap.org/search'
        && req.params.get('q') === 'no-such-place')
      .flush([]);

    expect(emittedResults).toHaveBeenCalledWith([]);
    expect(component.errorMessage).toBe('Aucun resultat trouve pour cette recherche.');
  });

  it('should emit an empty result set and display an error when the API fails', () => {
    const emittedResults = jasmine.createSpy('emittedResults');
    component.resultsFound.subscribe(emittedResults);
    component.query = 'Paris';

    component.search();
    httpMock.expectOne(req => req.url === 'https://nominatim.openstreetmap.org/search')
      .flush('Network error', { status: 500, statusText: 'Server error' });

    expect(emittedResults).toHaveBeenCalledWith([]);
    expect(component.errorMessage).toBe('La recherche a echoue. Verifiez votre connexion puis reessayez.');
    expect(component.isLoading).toBeFalse();
  });
});
