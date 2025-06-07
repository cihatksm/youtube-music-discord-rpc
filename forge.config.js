import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const name = 'Youtube Music Discord RPC';
const description = packageJson.description;

export default {
  packagerConfig: {
    name,
    executableName: packageJson.name,
    icon: path.resolve(__dirname, 'assets/icon.ico'),
    asar: {
      unpack: '*.{node,dll}'
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: packageJson.name,
        authors: packageJson.author.name,
        description,
        iconUrl: path.resolve(__dirname, 'assets/icon.ico'),
        setupIcon: path.resolve(__dirname, 'assets/icon.ico'),
        setupExe: packageJson.name + '-' + packageJson.version.replaceAll('.', '_') + '-Setup.exe',
        setupMsi: packageJson.name + '-' + packageJson.version.replaceAll('.', '_') + '-Setup.msi',
        shortcuts: {
          createDesktopShortcut: true
        }
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: true,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
