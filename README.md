<h1 align="center">
<a href="https://github.com/marceloavf/github-tools-vsts/"><img src="https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/icon512.png" alt="GitHub Tools" width="160"></a>
<br>
GitHub Tool
<br>
</h1>
<h4 align="center">Create and modify GitHub Releases. For Azure DevOps Builds and Releases.</h4>
<p align="center">GitHub Tool Task provide full implementation to Create and Modify GitHub Release to Azure DevOps Build and Release Management. <a href="https://github.com/marceloavf/github-tools-vsts/wiki">Learn More</a>
</p>
<h4 align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) ![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) 
![Visual Studio Team services](https://img.shields.io/vso/build/precisaosistemas/bdc79f70-6107-4e5b-9455-73bbd6bc0f22/115.svg) [![GitHub release](https://img.shields.io/github/release/marceloavf/github-tools-vsts.svg)](https://github.com/marceloavf/github-tools-vsts/releases) [![VS Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/marcelo-formentao.github-tools.svg)](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools) [![VS Marketplace Installs](https://vsmarketplacebadge.apphb.com/installs/marcelo-formentao.github-tools.svg)](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools)

</h4>

## Tasks included

- [**Create or Modify GitHub Release:**](https://github.com/marceloavf/github-tools-vsts/wiki#create-or-modify-github-release-task) Create or modify GitHub Release, allowing to upload assets, check manifest content and more.

![create-modify-release](https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/create-release-options.png)

![task-create-modify-release](https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/task-create-release.png)

Options include:

- **GitHub Connection:** Connect to a service endpoint for your GitHub Connection. [More Info.](https://github.com/marceloavf/github-tools-vsts#github-connection)
- **Repository:** List all repositories based on Endpoint. If empty, it will be extracted from manifest file.
- **Tag:** Create a tag to release. If empty, the version will be extracted from manifest file.
- **Release Title:** Create a title to release. If empty, it will be the same as tag.
- **Release Notes:** Create a note to release. If empty, it will be left undefined.
- **Draft:** Check to release tagged as Draft.
- **Pre Release:** Check to release tagged as Pre Release.
- **Ignore Assets:** Check to skip upload assets to release.
- **Files to Upload as Assets:** Include files to upload as artifacts to release. Minimatch pattern are supported.
- **Manifest JSON:** Include the manifest file from which default values will be extracted if options are missing. [More Info.](https://github.com/marceloavf/github-tools-vsts#manifest-file)

Advanced Options include:

- **Reuse Release:** Check to allow to reuse a release with the same tag.
- **Reuse only Draft Release:** Check to allow to reuse only draft release. Prevents from editing already published releases.
- **Skip Duplicated Assets:** Check to prevent the plugin to replace assets with the same name.
- **Edit Release** Check to allow to edit release name, notes, type (`draft, prerelease, release`) and target commitsh. [More Info.](https://github.com/marceloavf/github-tools-vsts#edit-release)
- **Delete Empty Tag** Check to delete tag if it's editing release type from `prerelease` or `release` to `draft`.
- **Target Commitsh:** Specifies the commitsh value that determines where the Git tag is created from. Can be any branch or commit SHA. Defaults to the default branch of the repository.
- **API URL:** Allow to use a custom API URL to connect to GitHub Enterprise instead of github.com. Defaults to 'https://api.github.com'.

> Modify will only be valid if the release has the same tag as the other one, and you have to allow Reuse Release or/and Reuse only Draft Release

## Modify

### Overwrite assets

1. The release tag option should have the same tag of the release you want to change.
2. The assets should have the same name to replace.
3. Leave unchecked `Skip Duplicated Assets` inside `Advanced` options.

### Edit release

This option allow to edit release properties based on `tag name`, changing the release name, notes, type (`draft, prerelease, release`) and target commitsh.

1. The release tag option should have the same tag of the release you want to change.
2. Write different name, notes, target commitsh or change the type of the release.
3. Check `Edit Release` inside `Advanced` options.

> Tip: `Delete Empty Tag` option allow to prevent an empty tag (without release) by deleting it when you edit release type from `prerelease` or `release` to `draft`

## More details

### Manifest file

The manifest is a json file (commonly called `package.json`) that include some information about your application, the GitHub Tool can extract these information when you indicate in `Manifest JSON` field where json file is located. Your json should be like this example below.

```json
{ 
   "version": "2.0.0", 
   "repository": { 
     "type": "git", 
     "url": "https://github.com/owner/repo" 
  } 
} 
```

### GitHub Connection

This option is one of the mandatory fields to allow GitHub Tool interact with GitHub API. For this, you have two options to create this connection:

#### 1. Authorize using OAuth

This service provides you direct and fast connection with GitHub authentication. If you need to modify some access and grant new authorizations you will have to access your GitHub acoount, go to `Settings` > `Applications` > `Authorized OAuth Apps`, found `Azure Pipelines (OAuth)` and modify permissions and organization access.

#### 2. Authorize with a GitHub personal access token

This option needs a personal access token from GitHub, you can create it by going to your GitHub account, `Settings` > `Developer settings` > `Personal access tokens` and click on `Generate New Token`.

| Scope  | Description |
| ------------- | ------------- |
| repo  | Allow access to private repositories  |
| public_repo  | Allow access to public repositories  |

### Creating service endpoints

Service endpoints can be created from the Azure Devops project dashboard, login and go to `Project Settings` > `Service connections` > `New service connection`.  Select `Github` from the list.  Chose authentication method (e.g. `OAuth` or  `Personal Access Token`). Then `Authorsize`, then Complete other details and finall `Save`.

## Why?

I was disappointed with all the current GitHub extensions tools solutions. Most of them don't have most of the options GitHub can provide and don't are maintained anymore. So, I found [publish-release](https://github.com/remixz/publish-release) repository with almost every option that I need, helped them to finish some issues and use that to create this extension for Azure DevOps Releases and Builds.

## Install the extension to your account

You can find the latest stable version of the Azure DevOps Extension tasks on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcelo-formentao.github-tools).

## Debug

Please refer to our debug [wiki page](https://github.com/marceloavf/github-tools-vsts/wiki/Debug)

## Contribute

Contributions, issues and feature requests are very welcome. Please make sure to read the [Contributing Guide](/CONTRIBUTING.md) before making a pull request.

## Known Issues

Please refer to our [wiki page](https://github.com/marceloavf/github-tools-vsts/wiki/Known-Issues)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="100px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://www.github.com/marceloavf)<br />[💻](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Code") [🎨](#design-marceloavf "Design") [📖](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Documentation") [🤔](#ideas-marceloavf "Ideas, Planning, & Feedback") [🚇](#infra-marceloavf "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars1.githubusercontent.com/u/1532486?v=4" width="100px;"/><br /><sub><b>Heath Stewart</b></sub>](https://blogs.msdn.microsoft.com/heaths/)<br />[💻](https://github.com/marceloavf/github-tools-vsts/commits?author=heaths "Code") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
