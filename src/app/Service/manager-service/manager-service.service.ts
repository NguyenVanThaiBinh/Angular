import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import{PhoneData} from 'src/dtos/phonedata.dto'

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private httpClient: HttpClient,) {}

  // API Json Server

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
    }),
  };
  private REST_API_SERVER = 'http://localhost:3000';

  

  public getPhoneData(): Observable<any> {
    const url = `${this.REST_API_SERVER}/phone`;
    return this.httpClient
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public deletePhoneData(id: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/phone/` + id;
    return this.httpClient
      .delete(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getOneData(id:number): Observable<any> {
    const url = `${this.REST_API_SERVER}/phone/` + id;
    return this.httpClient
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public updatePhoneData(id: number, phoneData : PhoneData) : Observable<any> {
    const url = `${this.REST_API_SERVER}/phone/` + id;
    return this.httpClient
      .patch(url,phoneData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
