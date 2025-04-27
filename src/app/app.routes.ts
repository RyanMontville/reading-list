import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FilterComponent } from './filter/filter.component';
import { StatsComponent } from './stats/stats.component';
import { TagsTestComponent } from './tags-test/tags-test.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'filter', component: FilterComponent},
    {path: 'stats', component: StatsComponent},
    {path: 'test', component: TagsTestComponent}
];
