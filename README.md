# Electron boilerplate with typescript/react support and webpack configs
## Quick Start

```bash
# clone the repo
git clone --depth 1 --single-branch https://github.com/JinCaoTH/electron-typescript-webpack-react-boilerplate.git your-project-name
cd your-project-name
yarn

# start dev server
yarn dev
```

## Feature

- Seperate compling of main/renderer/preload scripts
- Webpack dev server for development.
- React hot reload based on [react-refresh](https://github.com/facebook/react/tree/master/packages/react-refresh) and [react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- Multi-window support by enforcing folder structure
- TODO: build related packages in /build folder with seperate package.json file
- No test related packages so you choose yourself

## Folder structure
- __./__
   - __build__             
   - __config__
   - __src__
     - __main__
       - [index.ts](src/main/index.ts)
     - __renderer__
       - __main__
         - [App.tsx](src/renderer/main/App.tsx)
         - [index.tsx](src/renderer/main/index.tsx)
         - [preload.ts](src/renderer/main/preload.ts)
       - __second__
         - [index.tsx](src/renderer/second/index.tsx)
         - [preload.ts](src/renderer/second/preload.ts)
     - [template.html](src/template.html)
