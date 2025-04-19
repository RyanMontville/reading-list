import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilterComponent } from './filter/filter.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'filter', component: FilterComponent}
];
