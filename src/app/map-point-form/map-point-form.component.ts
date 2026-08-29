import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeocodingResult } from '../models/geocoding-result.model';
import { MapPointsService } from '../services/map-points.service';

@Component({
  selector: 'app-map-point-form',
  templateUrl: './map-point-form.component.html',
  styleUrls: ['./map-point-form.component.scss']
})
export class MapPointFormComponent implements OnChanges {
  @Input() selectedResult: GeocodingResult | null = null;

  savedMessage = '';

  readonly pointForm = this.formBuilder.group({
    name: ['', Validators.required],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly mapPointsService: MapPointsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedResult'] && this.selectedResult) {
      this.pointForm.patchValue({
        name: this.selectedResult.displayName,
        latitude: this.selectedResult.latitude,
        longitude: this.selectedResult.longitude
      });
      this.savedMessage = '';
    }
  }

  savePoint(): void {
    this.savedMessage = '';

    if (this.pointForm.invalid) {
      this.pointForm.markAllAsTouched();
      return;
    }

    const value = this.pointForm.getRawValue();
    this.mapPointsService.addPoint({
      name: value.name ?? '',
      latitude: Number(value.latitude),
      longitude: Number(value.longitude)
    });
    this.savedMessage = 'Point sauvegarde sur la carte.';
  }

  hasError(controlName: 'name' | 'latitude' | 'longitude'): boolean {
    const control = this.pointForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
