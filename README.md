<p align="center">
  <a href="https://galata.app">
    <img alt="Trozas" src="https://github.com/Galata-App/trozas/blob/main/src-tauri/icons/icon.png?raw=true" width="60" />
  </a>
</p>
<h1 align="center">
    Trozas
</h1>

<p align="center">
  <strong>
    A tool for reviewing pod logs through Kubernetes management tool APIs 🪵
  </strong>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Trozas is released under the MIT license." style="margin-right: 4px;"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" style="margin-right: 4px;"/>
    <a href="https://twitter.com/intent/follow?screen_name=galata_app">
        <img src="https://img.shields.io/twitter/follow/galata_app.svg?label=Follow%20@galata_app" alt="Follow @galata_app" />
    </a>
</p>

## Setup

### Rancher Connection Details

Once you have downloaded and installed the app, you will need to input your Rancher details. Once signed into the Rancher web app, you should see a profile image to the right side of
the top nav bar. Upon clicking that image, you should be presented with a dropdown which includes "Accounts & API Keys". You will need to click this link and navigate to the API Keys page
(Note: this may take some time as rancher's /tokens request can take a while for some reason).

From the Account & API Keys page, you should see a url next to "API Endpoint". This will be your "Instance URL" value however, it should be noted that the `v3` portion of this url should be left off as Trozas
handles this internally. You will next need to click the "Create API Key" button. This will present a form for you to complete. Unless you are only monitoring a specific cluster, I would recommend not scoping
the key and then set any sort of expiration you would like (for safety, I typically set the expiry to 365 days). After completing the form, you will be presented with some information. The `Bearer Token`
value is what you will want for your "API Token" in the Trozas application.

After entering these values into the Trozas application, you can click "Submit" and you should be good to go!

## Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
