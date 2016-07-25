"use strict";
var router_1 = require('@angular/router');
var settings_component_1 = require("./settings/settings.component");
var assignment_component_1 = require("./assignment/assignment.component");
var routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        terminal: true
    },
    {
        path: 'assignment',
        component: assignment_component_1.AssignmentComponent
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
        component: settings_component_1.SettingsComponent
    }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map