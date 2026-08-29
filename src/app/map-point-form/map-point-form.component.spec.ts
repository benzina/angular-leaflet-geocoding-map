import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MapPointsService } from '../services/map-points.service';
import { MapPointFormComponent } from './map-point-form.component';

describe('MapPointFormComponent', () => {
  let component: MapPointFormComponent;
  let fixture: ComponentFixture<MapPointFormComponent>;
  let mapPointsService: jasmine.SpyObj<MapPointsService>;

  beforeEach(async () => {
    mapPointsService = jasmine.createSpyObj<MapPointsService>('MapPointsService', ['addPoint']);

    await TestBed.configureTestingModule({
      declarations: [MapPointFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MapPointsService, useValue: mapPointsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should prefill the form from the selected search result', () => {
    component.selectedResult = {
      displayName: 'Paris, France',
      latitude: 48.8566,
      longitude: 2.3522
    };

    component.ngOnChanges({
      selectedResult: {
        currentValue: component.selectedResult,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.pointForm.value).toEqual({
      name: 'Paris, France',
      latitude: 48.8566,
      longitude: 2.3522
    });
  });

  it('should reject an empty name and invalid coordinates', () => {
    component.pointForm.setValue({
      name: '',
      latitude: 120,
      longitude: -250
    });

    component.savePoint();

    expect(component.pointForm.invalid).toBeTrue();
    expect(mapPointsService.addPoint).not.toHaveBeenCalled();
  });

  it('should call the service with valid form values', () => {
    component.pointForm.setValue({
      name: 'Paris office',
      latitude: 48.8566,
      longitude: 2.3522
    });

    component.savePoint();

    expect(mapPointsService.addPoint).toHaveBeenCalledWith({
      name: 'Paris office',
      latitude: 48.8566,
      longitude: 2.3522
    });
    expect(component.savedMessage).toBe('Point sauvegarde sur la carte.');
  });
});
