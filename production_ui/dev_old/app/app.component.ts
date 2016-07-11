import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {HeroService}     from './hero.service';
import {SettingService} from "./settings/setting.service";
@Component({
    selector: 'my-app',
    template: `
        <nav>
            <a [routerLink]="['/dashboard']" routerLinkActive="active">Backlog</a>
            <a [routerLink]="['/heroes']" routerLinkActive="active">Assignment</a>
            <a [routerLink]="['/settings']" routerLinkActive="active">Settings</a>
        </nav>
    <router-outlet></router-outlet>
    `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HeroService, SettingService
    ]
})
export class AppComponent {
    title = 'Flashcard Admin';
}
