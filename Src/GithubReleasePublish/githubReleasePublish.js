import readManifest from 'CommonNode/readManifest.js'
import bytesToSize from 'CommonNode/bytesToSize.js'

const publishRelease = require('publish-release')
const tl = require('vsts-task-lib/task')

/** Endpoint */
const githubEndpoint = tl.getInput('githubEndpoint')
const githubEndpointToken = tl.getEndpointAuthorization(githubEndpoint)
  .parameters.accessToken

/** Inputs */
const githubRepository = tl.getInput('githubRepository')
  ? tl.getInput('githubRepository').split('/')
  : null
const githubTag = tl.getInput('githubTag')
const githubReleaseTitle = tl.getInput('githubReleaseTitle')
const githubReleaseNotes = tl.getInput('githubReleaseNotes')

/** Booleans */
const githubReleaseDraft = tl.getBoolInput('githubReleaseDraft')
const githubReleasePrerelease = tl.getBoolInput('githubReleasePrerelease')

/** Paths */
const manifestJson = tl.getPathInput('manifestJson')
const githubReleaseAsset = tl.getPathInput('githubReleaseAsset')

/** Check for options in manifest if they don't exists on input */
const manifestOptions = readManifest(manifestJson)

/**
 * Set all options
 */
let options = {}
options.token =
  githubEndpointToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN // or you can set an env var called GITHUB_TOKEN instead
options.owner =
  (githubRepository && githubRepository[0]) ||
  manifestOptions.owner || // if missing, it will be extracted from manifest (the repository.url field)
  undefined
options.repo =
  (githubRepository && githubRepository[1]) ||
  manifestOptions.repo || // if missing, it will be extracted from manifest (the repository.url field)
  undefined
options.tag =
  githubTag ||
  (manifestOptions && `v${manifestOptions.version}`) || // if missing, the version will be extracted from manifest and prepended by a 'v'
  undefined
options.name = githubReleaseTitle || options.tag || undefined // if missing, it will be the same as the tag
options.notes = githubReleaseNotes || undefined // if missing it will be left undefined
options.draft = githubReleaseDraft || false // if missing it's false
options.prerelease = githubReleasePrerelease || false // if missing it's false
options.reuseRelease = true // if you don't want the plugin to create a new release if one already exists for the given tag.
options.reuseDraftOnly = true // if you only want to reuse a release if it's a draft. It prevents you from editing already published releases.
options.assets = [githubReleaseAsset] // assets array
options.apiUrl = 'https://api.github.com' // Use a custom API URL to connect to GitHub Enterprise instead of github.com.

/**
 * Start the release
 * TODO: Release URL only works if it's not draft release
 */
const release = publishRelease(options, (err, release) => {
  if (err) {
    tl.debug(err)
    return false
  }
  console.log(`Finish - Release URL: ${release.url}`)
})

release.on('error', existingError => {
  if (existingError instanceof Error) {
    tl.debug('error', existingError)
  } else {
    tl.debug('error', new Error(JSON.stringify(existingError)))
  }
})

/**
 * TODO: dynamic 'github.com' url since you can change API URL with parameters
 */
release.on('created-release', () => {
  console.log(
    `Release created successfully at
    https://github.com/${options.owner}/${options.repo}/releases/tag/${
  options.tag
}`
  )
})

/**
 * TODO: Analyse options to return the correct message, e.g.
 * IF reuseDraftOnly is true and reuseRelease is true, it will not override releases the assets, only drafts (need to test too)
 * IF reuseDraftOnly is false and reuseRelease is true, it will override releases and draft assets (test too)
 * ISSUE: publish-release seems not to replace the asset: https://github.com/remixz/publish-release/issues/24
 */
release.on('reuse-release', () => {
  console.log(`Reuse release - the assets will be uploaded to an existing one`)
})

release.on('upload-progress', (name, progress) => {
  console.log(
    `Uploading asset ${name} - ${Math.floor(
      progress.percentage
    )}% - ${bytesToSize(progress.speed)}/s`
  )
})