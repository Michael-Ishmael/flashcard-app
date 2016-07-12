import { provideRouter, RouterConfig }  from '@angular/router';
import {SettingsComponent} from "./settings/settings.component";


const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/dashboard',
        terminal: true
    },
    // {
    //     path: 'heroes',
    //     component: HeroesComponent
    // },
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
