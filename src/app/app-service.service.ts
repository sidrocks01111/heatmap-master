import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {users} from './users';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient) { }

  // getting the url for the backend data 

  getdata(){
    let url = "http://localhost:3000";
    return this.http.get(url);
  }
}
