# NGXS Schematics

Ngxs Schematics makes it easy to create a state files.

Ngxs Schematics create a tree

```treeview
├── states/
│   ├── <your-state-name>.state.ts/
│   ├── index.ts/
├── actions/
│   ├── <your-state-name>.actions.ts/
│   ├── index.ts/
├── models/
│   ├── <your-state-name>.ts/
│   ├── index.ts/
```

### Installation

Run the following code in your terminal:

```bash
npm install ngxs-schematic --dev

# or if you are using yarn

yarn add ngxs-schematic --dev
```

### Usage

```bash
yarn ng generate ngxs-schematic:state <your-state-name> <your-path> --project <your-project-name> --module <your-module-path> --forRoot <true|false> --skipImport <true|false>
```

Properties:

```json
// Required
// Your state name
"name": {
  "type": "string",
  "$default": {
    "$source": "argv",
    "index": 0
  }
},
/*
Optional
If you are do not enter a path,
ngxs-schematic will use your selected project source path
An app example src/app/store
An lib example projects/core/src/lib
*/
"path": {
  "type": "string",
  "$default": {
    "$source": "argv",
    "index": 1
  }
},
/*
Optional
If you are do not enter a project name,
ngxs-schematic will use your default project
If your project an app,
ngxs-schematic will create files under the store folder
projects/example-app/src/ + store/
*/
"project": {
  "type": "string"
},
// Your module path for the importing NgModule. If you do not enter. ngxs-schematic will find automaticly.
"module": {
  "type": "string"
},
// Flag to setup the forRoot state or forFeature state.
"forRoot": {
  "type": "boolean"
},
// Flag to importing NgModule.
"skipImport": {
  "type": "boolean",
  "default": false
}
```

### Another Usage

Add the following code in your angular.json file.

```json
...
"cli": {
  "defaultCollection": "ngxs-schematic"
}
```

Then, your project able to run the following code

```bash
yarn ng generate state my-state
```

Do you need help?

```bash
yarn ng g ngxs-schematic:state --help
```
