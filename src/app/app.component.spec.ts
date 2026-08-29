import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { GeocodingComponent } from './geocoding/geocoding.component';
import { MapPointFormComponent } from './map-point-form/map-point-form.component';
import { MapComponent } from './map/map.component';
import { ResultsListComponent } from './results-list/results-list.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        GeocodingComponent,
        ResultsListComponent,
        MapPointFormComponent,
        MapComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LeafletModule
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update results and selected result from child events', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const result = {
      displayName: 'Paris, France',
      latitude: 48.8566,
      longitude: 2.3522
    };

    app.handleResultsFound([result]);
    app.handleResultSelected(result);

    expect(app.results).toEqual([result]);
    expect(app.hasSearched).toBeTrue();
    expect(app.selectedResult).toEqual(result);
  });
});
