"use strict"

const packageJson = require("./package.json");
const builder = require("electron-builder");
const Platform = builder.Platform;

// Let's get that intellisense working
/**
* @type {import('electron-builder').Configuration}
* @see https://www.electron.build/configuration
*/
const options = {
    appId: packageJson.name,
    productName: packageJson.longname,
    directories: {
        output: "out",
        buildResources: "assets"
    },
    files: [
        "**/*",
        "!node_modules/*/{test,__tests__}/**",
        "!dist{,/**/*}",
        "!assets{,/**/*}"
    ],
    win: {
        target: "nsis",
        icon: "assets/new-icon.ico",
        executableName: packageJson.name,
        releaseInfo: {
            releaseName: packageJson.longname,
            releaseNotes: packageJson.description,
            releaseNotesFile: "README.md",
            releaseDate: new Date().toLocaleString()
        }
    },
    nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        deleteAppDataOnUninstall: true,

        allowElevation: true,
        artifactName: "${productName}Setup.${ext}",
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        differentialPackage: true,
        installerHeader: "assets/installerHeader.bmp",
        installerHeaderIcon: "assets/new-icon.ico",
        installerIcon: "assets/new-icon.ico",
        license: "LICENSE",
        shortcutName: packageJson.longname,
        uninstallDisplayName: packageJson.longname
    },
};

builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: options
})
    .then((result) => {
        console.log(JSON.stringify(result))
    })
    .catch((error) => {
        console.error(error)
    })