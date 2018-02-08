<h1 align="center">
<a href="https://github.com/marceloavf/github-tools-vsts/"><img src="https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/icon512.png" alt="GitHub Tools" width="160"></a>
<br>
GitHub Tool
<br>
</h1>
<h4 align="center">Create and modify GitHub Releases. For VSTS Builds and Releases.</h4>
<p align="center">GitHub Tool Task provide full implementation to Create and Modify GitHub Release to Visual Studio Team Services Build and Release Management. <a href="https://github.com/marceloavf/github-tools-vsts/wiki">Learn More</a>
</p>
<h4 align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) 
![Visual Studio Team services](https://img.shields.io/vso/build/precisaosistemas/bdc79f70-6107-4e5b-9455-73bbd6bc0f22/115.svg) [![GitHub release](https://img.shields.io/github/release/marceloavf/github-tools-vsts.svg)](https://github.com/marceloavf/github-tools-vsts/releases) [![VS Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/marcelo-formentao.github-tools.svg)](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools) [![VS Marketplace Installs](https://vsmarketplacebadge.apphb.com/installs/marcelo-formentao.github-tools.svg)](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools)

</h4>

## Tasks included

- [**Create or Modify GitHub Release:**](https://github.com/marceloavf/github-tools-vsts/wiki#create-or-modify-github-release-task) Create or modify GitHub Release, allowing to upload assets, check manifest content and more.

![create-modify-release](https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/create-release-options.png)

![task-create-modify-release](https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/task-create-release.png)

Options include:

- **GitHub Connection:** Connect to a service endpoint for your GitHub Connection.
- **Repository:** List all repositories based on Endpoint. If empty, it will be extracted from manifest file.
- **Tag:** Create a tag to release. If empty, the version will be extracted from manifest file.
- **Release Title:** Create a title to release. If empty, it will be the same as tag.
- **Release Notes:** Create a note to release. If empty, it will be left undefined.
- **Draft:** Check to release tagged as Draft.
- **Pre Release:** Check to release tagged as Pre Release.
- **Ignore Assets:** Check to skip upload assets to release.
- **Files to Upload as Assets:** Include files to upload as artifacts to release. Minimatch pattern are supported.
- **Manifest JSON:** Include the manifest file from which default values will be extracted if options are missing.

Advanced Options include:

- **Reuse Release:** Check to allow to reuse a release with the same tag.
- **Reuse only Draft Release:** Check to allow to reuse only draft release. Prevents from editing already published releases.
- **Skip Duplicated Assets:** Check to prevent the plugin to replace assets with the same name.
- **Target Commitsh:** Specifies the commitsh value that determines where the Git tag is created from. Can be any branch or commit SHA. Defaults to the default branch of the repository.
- **API URL:** Allow to use a custom API URL to connect to GitHub Enterprise instead of github.com. Defaults to 'https://api.github.com'.

> Modify will only be valid if the release has the same tag as the other one, and you have to allow Reuse Release or/and Reuse only Draft Release

## Modify

### Overwrite assets

1. The release tag option should have the same tag of the release you want to change
2. The assets should have the same name to replace.
3. Leave unchecked `Skip Duplicated Assets` inside `Advanced` options.

## Install the extension to your account

You can find the latest stable version of the VSTS Extension tasks on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools).

## Debug

[vsts-task-lib](https://github.com/Microsoft/vsts-task-lib/blob/master/node/docs/vsts-task-lib.md) allow to pass properties running on development and debugging errors. The base script is `yarn dev:debug`, creating a connection with chrome devtools.

To it work properly, you first need to export options, for example:

```
export INPUT_GITHUBENDPOINT='EP'
export ENDPOINT_URL_EP='https://www.github.com/'
export ENDPOINT_AUTH_EP='{"parameters":{"accessToken":"*****"}}'
export INPUT_GITHUBREPOSITORY='owner/repository'
export INPUT_GITHUBTAG='v0.0.0'
export INPUT_GITHUBRELEASETITLE='v0.0.0'
export INPUT_GITHUBRELEASEDRAFT=True/False
export INPUT_GITHUBRELEASEASSET='xxxx\**\*.png'
export INPUT_MANIFESTJSON='xxxx\manifest.json'
```

Then `yarn dev:debug`

## Why?

I was disappointed with all the current GitHub extensions tools solutions. Most of them don't have most of the options GitHub can provide and don't are maintained anymore. So, I found [publish-release](https://github.com/remixz/publish-release) repository with almost every option that I need, helped them to finish some issues and use that to create this extension for VSTS Releases and Builds.

## Contribute

If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github. Please refer to our [wiki page](https://github.com/marceloavf/github-tools-vsts/wiki/How-to-Report-an-issue)

If you'd like to make some changes yourself, see the following:
1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Make sure yarn is globally installed (`npm install -g yarn`)
3. Run `yarn` to download required packages
4. Build the application: `yarn build`
5. Follow [Commit message guidelines](https://github.com/semantic-release/semantic-release/blob/caribou/CONTRIBUTING.md#commit-message-guidelines) from Semantic-release
6. If you contributed something new, run `yarn contrib:add <your GitHub username>` to add yourself [below](#contributors)
7. Finally, submit a [pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) with your changes!

## Known Issues

Please refer to our [wiki page](https://github.com/marceloavf/github-tools-vsts/wiki/Known-Issues)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="100px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://github.com/marceloavf)<br />[💻](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Code") [🎨](#design-marceloavf "Design") [📖](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Documentation") [🤔](#ideas-marceloavf "Ideas, Planning, & Feedback") [🚇](#infra-marceloavf "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!