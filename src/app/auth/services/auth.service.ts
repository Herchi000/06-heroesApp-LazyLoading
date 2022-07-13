import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators'

import { Auth } from '../interfaces/auth.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth(){
    return {...this._auth}
  }

  constructor(private http: HttpClient) { }

  verificaAutentificacion(): Observable<boolean>{

    if(!localStorage.getItem('token')){
      return of(false); //El of transforma un valor en un observable
    }

    return this.http.get<Auth>(`${this.baseURl}/usuarios/1`)
      .pipe(
        map( auth => {
          this._auth = auth;
          return true
          
        })
      )
    

  }

  login(){
    return this.http.get<Auth>(`${this.baseURl}/usuarios/1`)
      .pipe(
        tap(auth => this._auth = auth),
        tap(auth => localStorage.setItem('token', auth.id))
      );
  }

  logout(){
    this._auth = undefined;
  }

}
