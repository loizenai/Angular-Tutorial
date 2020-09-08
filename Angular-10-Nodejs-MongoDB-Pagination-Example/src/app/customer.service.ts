import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError  } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) { }


  /**
   * Retrieve all customer from Backend
   */
  getPagableCustomers(pageNumber: number, 
                        pageSize: number, salary: number,
                        agesorting: boolean, desc: boolean): Observable<Message> {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('page', pageNumber.toString());
    params = params.append('size', pageSize.toString());
    params = params.append('salary', salary.toString());
    params = params.append('agesorting', agesorting.toString());
    params = params.append('desc', desc.toString());

    return this.http.get<Message>(`${this.baseUrl}` + `/pagefiltersort`, { params: params })
                  .pipe(
                    retry(3),
                    catchError(this.handleError)
                  );
  }

  getListSalaries(): Observable<Array<number>>{
    return this.http.get<Array<number>>(`${this.baseUrl}` + `/salaries`)
                  .pipe(
                    retry(3),
                    catchError(this.handleError)
                  );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}