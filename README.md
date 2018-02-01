<h1 align="center">
<a href="https://github.com/marceloavf/github-tools-vsts/"><img src="https://github.com/marceloavf/github-tools-vsts/blob/master/Extension/images/icon512.png" alt="GitHub Tools" width="160"></a>
<br>
GitHub Tools
<br>
</h1>
<h4 align="center">Create and modify GitHub Releases. For VSTS Builds and Releases.</h4>

<h4 align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) [![Dependency Status](https://david-dm.org/marceloavf/github-tools-vsts/dev-status.svg)](https://david-dm.org/marceloavf/github-tools-vsts)

</h4>

## Debug

[vsts-task-lib](https://github.com/Microsoft/vsts-task-lib/blob/master/node/docs/vsts-task-lib.md) allow to pass properties, running on development and debugging errors. The base script is `yarn dev:debug`, creating a connection with chrome devtools, for example.

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

## Contribute

If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.

If you'd like to make some changes yourself, see the following:
1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Make sure yarn is globally installed (`npm install -g yarn`)
3. Run `yarn` to download required packages
4. Build the application: `yarn build`
5. If you contributed something new, run `yarn contrib:add <your GitHub username>` to add yourself [below](#contributors)
6. Finally, submit a [pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) with your changes!

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5435657?v=4" width="100px;"/><br /><sub><b>Marcelo Formentão</b></sub>](https://github.com/marceloavf)<br />[💻](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Code") [🎨](#design-marceloavf "Design") [📖](https://github.com/marceloavf/github-tools-vsts/commits?author=marceloavf "Documentation") [🤔](#ideas-marceloavf "Ideas, Planning, & Feedback") [🚇](#infra-marceloavf "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!