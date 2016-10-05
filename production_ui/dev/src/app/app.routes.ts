import { provideRouter, RouterConfig }  from '@angular/router';
import {SettingsComponent} from "./settings/settings.component";
import {AssignmentComponent} from "./assignment/assignment.component";
import {BacklogComponent} from "./backlog/backlog.component";
import {CropComponent} from "./crop/crop.component";
import {DeploymentComponent} from "./deployment/deployment.component";
import {DoneListComponent} from "./done-list/done-list.component";


const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/assignment',
        terminal: true
    },
    {
        path: 'assignment',
        component: AssignmentComponent
    },
    {
        path: 'backlog',
        component: BacklogComponent
    },
    {
        path: 'deployment',
        component: DeploymentComponent
    },
    {
        path: 'completed',
        component: DoneListComponent
    },
    {
        path: 'crop/:id',
        component: CropComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }

];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
