import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { YearComponent } from './year/year.component';
import { AuthorComponent } from './author/author.component';
import { FilterComponent } from './filter/filter.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'year/:year', component: YearComponent},
    {path: 'author/:author', component: AuthorComponent},
    {path: 'filter', component: FilterComponent}
];
