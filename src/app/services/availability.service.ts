import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailabilitySlot } from '../../interface/responseData';


@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private base = 'http://localhost:8000/api/hours';

  constructor(private http: HttpClient) {}

  getSlots(): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(this.base);
  }

  saveSlots(slots: AvailabilitySlot[]): Observable<{message:string}> {
    return this.http.post<{message:string}>(this.base, { availabilities: slots });
  }
}
