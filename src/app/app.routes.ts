import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { YearComponent } from './year/year.component';
import { AuthorComponent } from './author/author.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: ':year', component: YearComponent},
    {path: 'author/:author', component: AuthorComponent}
];
