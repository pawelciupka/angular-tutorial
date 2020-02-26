import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes"
import { MessageService } from "./message.service"
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   *  GET heroes from the server
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched herose')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** 
   * GET hero by id from the server
   * @param id 
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero with id ${id}`)),
        catchError(this.handleError<Hero>(`getHero with id ${id}`))
      );
  }

  /** 
   * PUT: update hero informations on the server
   * @param hero 
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero with id ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /** 
   * POST: create a new hero to the server
   * @param hero 
   */
  createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`create a new hero with id ${hero.id}`)),
        catchError(this.handleError<any>('createHero'))
      );
  }

  /**
   * DELETE hero from the server
   * @param hero 
   */
  removeHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`
    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`remove a hero with id ${hero.id}`)),
        catchError(this.handleError<any>('removeHero'))
      );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([])
    }
    const url = `${this.heroesUrl}/?name=${term}`
    return this.http.get<Hero[]>(url).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching term ${term}`) :
        this.log(`not found heroes matching term ${term}`)),
      catchError(this.handleError<any>(`searchHero`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error)
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }

  }
}
