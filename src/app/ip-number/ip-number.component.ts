import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'custom-ip-number',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Ip <-> Number</mat-card-title>
        <mat-card-subtitle>Ip to number and number to Ip converter</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>
          <mat-form-field>
            <input matInput
            type="text"
            placeholder="Ip"
            autocomplete="off"
            [formControl]="ip">
            <mat-error *ngIf="ip.invalid">Please enter valid ip.</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput
            type="number"
            placeholder="Number"
            autocomplete="off"
            [formControl]="number">
            <mat-error *ngIf="ip.invalid">Please enter valid number.</mat-error>
          </mat-form-field>
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .mat-card {
      max-width: 400px;
    }
    .mat-form-field{
      width: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None // Native does not work with material
})
export class IpNumberComponent {
  static ipPattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  ip = new FormControl('', [Validators.minLength(7), Validators.maxLength(15), Validators.pattern(IpNumberComponent.ipPattern)]);
  number = new FormControl('', [Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]);

  constructor() {
    this.ip.valueChanges.subscribe(value => {
      if (this.ip.valid) {
        const splitted = value.split('.');
        const number = (Math.pow(256, 3) * splitted[0]) +
          (Math.pow(256, 2) * splitted[1]) +
          (Math.pow(256, 1) * splitted[2]) +
          (Math.pow(256, 0) * splitted[3]);
        this.number.setValue(number, { emitEvent: false });
      }
    });
    this.number.valueChanges.subscribe(value => {
      if (this.number.valid) {
        const ipParts = [];
        ipParts[3] = value % 256;
        ipParts[2] = Math.floor(value / 256) % 256;
        ipParts[1] = Math.floor(value / Math.pow(256, 2)) % 256;
        ipParts[0] = Math.floor(value / Math.pow(256, 3)) % 256;
        this.ip.setValue(ipParts.join('.'), { emitEvent: false });
      }
    });
  }
}
