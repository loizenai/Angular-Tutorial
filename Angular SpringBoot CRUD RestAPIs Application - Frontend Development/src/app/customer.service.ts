import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError  } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Customer } from './customer';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) { }

  /**
   * Do a posting Customer
   * @param customer 
   */
  createCustomer(customer: Customer): Observable<Message> {
      return this.http.post<Message>(`${this.baseUrl}` + `/create`, customer)
                  .pipe(
                    retry(3),
                    catchError(this.handleError)
                  );
  }

  updateCustomer(customer: Customer): Observable<Message> {
      return this.http.put<Message> (`${this.baseUrl}` + `/updatebyid/` + customer.id, customer)
        .pipe(
            retry(3),
            catchError(this.handleError)
          );
  }

  deleteCustomer(id: number): Observable<Message> {
      return this.http.delete<Message>(`${this.baseUrl}` + `/deletebyid/` + id)
            .pipe(
              retry(3),
              catchError(this.handleError)  
            );
  }

  /**
   * Retrieve all customer from Backend
   */
  retrieveAllCustomers(): Observable<Message> {
      return this.http.get<Message>(`${this.baseUrl}` + `/retrieveinfos`)
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