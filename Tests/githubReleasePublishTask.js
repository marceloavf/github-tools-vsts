const path = require('path')
const ma = require('../Src/GithubReleasePublish/node_modules/vsts-task-lib/mock-answer')
const tmrm = require('../Src/GithubReleasePublish/node_modules/vsts-task-lib/mock-run')

let taskPath = path.join(__dirname, '../Tasks/GithubReleasePublish/', 'githubReleasePublish.js')
let tr = new tmrm.TaskMockRunner(taskPath)

tr.setInput('githubEndpoint', 'EP')
process.env['ENDPOINT_URL_EP'] = 'https://www.github.com/'
process.env['ENDPOINT_AUTH_EP'] = '{"parameters":{"accessToken":"test"}}'
tr.setInput('githubRepository', 'test/test')
tr.setInput('githubTag', 'v0.1.0')
tr.setInput('githubReleaseTitle', 'v0.1.0')
tr.setInput('githubReleaseDraft', true)
tr.setInput('githubReleaseAsset', 'test.png')
tr.setInput('manifestJson', 'manifest.json')

tr.run()
