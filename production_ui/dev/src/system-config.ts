// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {};

/** User packages configuration. */
const packages: any = {
  'ng2-bootstrap': {
    format: 'cjs',
    defaultExtension: 'js',
    main: 'ng2-bootstrap.js'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',
  'ng2-bootstrap',

  // App specific barrels.
  'app',
  'app/shared',
  'app/assignment',
  'app/assignment/folder-structure',
  'app/assignment/folder-structure/fso-item',
  'app/deck-sets',
  'app/deck-sets/deck-set-form',
  'app/deck-sets/deck-set-display',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'ng2-bootstrap': 'vendor/ng2-bootstrap',
    'moment': 'vendor/moment/moment.js',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
