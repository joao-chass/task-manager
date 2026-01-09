import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from '../crypto/crypto';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private criptoService : CryptoService) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`)
      .pipe(
        map(users => {
          const user = users[0];
          if (user && this.criptoService.decrypt(user.password) === password) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          return null;
        }),
        catchError(() => of(null))
      );
  }

  register(user: User): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
      map(existingUsers => {
     
        if (existingUsers.length > 0) {
          throw { status: 409, message: 'Email já cadastrado' };
        }
        return user;
      }),
      
      switchMap(() => this.http.post<User>(this.apiUrl, {
        ...user,
        id: Date.now(), 
        createdAt: new Date().toISOString()
      })),
      tap(newUser => {
     
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        if (error.status === 409) {
          return throwError(() => ({ 
            status: 409, 
            message: 'Este email já está cadastrado' 
          }));
        }
        return throwError(() => ({ 
          status: 500, 
          message: 'Erro ao criar conta. Tente novamente.' 
        }));
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
