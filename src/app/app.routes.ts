import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilterComponent } from './filter/filter.component';
import { StatsComponent } from './stats/stats.component';
import { VlogbrothersComponent } from './vlogbrothers/vlogbrothers.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'filter', component: FilterComponent},
    {path: 'stats', component: StatsComponent},
    {path: 'vlogbrothers', component: VlogbrothersComponent}
];
