import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Record {
  id: number | null;
  name: string;
  age: number | null;
  country: string;
}

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css'],
  standalone: true,
  imports: [MatTableModule, MatExpansionModule, CommonModule, FormsModule],
})
export class UsertableComponent {
  dummyRecords: Record[] = [
    { id: 1, name: 'Eren', age: 25, country: 'India' },
    { id: 2, name: 'Mikasa', age: 22, country: 'Australia' },
    { id: 3, name: 'Luffy', age: 35, country: 'UK' },
    { id: 4, name: 'Levi', age: 30, country: 'Japan' },
    { id: 5, name: 'Naruto', age: 26, country: 'Korea' },
    // Add more records as needed
  ];

  private unsubscribe$ = new Subject<void>();
  tempRecords: Record[] = [];
  panelOpenState = false;

  constructor(private router: Router, private httpClient: HttpClient) {}

  isLoading = false;

  ngOnInit(): void {
    this.fetchApiData();
    this.dummyRecords.forEach((record, index) => {
      this.tempRecords[index] = {
        id: null,
        name: '',
        age: null,
        country: '',
      };
    });
  }

  fetchApiData(): void {
    this.httpClient
      .get<[]>('https://dummyjson.com/users')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          console.log('API Data:', data);
        },
        (error) => {
          console.error('Error fetching API data:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getColumnKeys(obj: Record): string[] {
    return Object.keys(obj);
  }

  saveChanges(index: number): void {
    console.log('click');
    this.isLoading = true;
    setTimeout(() => {
      this.dummyRecords[index] = { ...this.tempRecords[index] };
      // Reset input fields
      this.tempRecords[index] = { id: null, name: '', age: null, country: '' };
      this.isLoading = false;
    }, 2000);
  }

  // Cancel changes and reset input fields
  cancelChanges(index: number): void {
    this.tempRecords[index] = { ...this.dummyRecords[index] };
    this.tempRecords[index] = { id: null, name: '', age: null, country: '' };
    this.panelOpenState = true;
  }

  // Save the changes
  updateSaveButtonState(index: number): boolean {
    return (
      !this.tempRecords[index].id ||
      !this.tempRecords[index].name ||
      this.tempRecords[index].age === null ||
      !this.tempRecords[index].country
    );
  }

  // Redirecting to Home Page
  redirectToHome(): void {
    console.log('Button clicked! Redirecting to home page.');
    this.router.navigate(['/home']);
    console.clear(); // Clear the console
  }
}
