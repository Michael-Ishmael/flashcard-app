import { provideRouter, RouterConfig }  from '@angular/router';
import {SettingsComponent} from "./settings/settings.component";
import {AssignmentComponent} from "./assignment/assignment.component";


const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/dashboard',
        terminal: true
    },
    {
        path: 'assignment',
        component: AssignmentComponent
    },
    // {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // },
    // {
    //     path: 'detail/:id',
    //     component: HeroDetailComponent
    // },
    {
        path: 'settings',
        component: SettingsComponent
    }

];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
