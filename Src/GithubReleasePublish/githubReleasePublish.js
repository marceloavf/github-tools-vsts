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
const githubApiUrl = tl.getInput('githubApiUrl')
const githubTargetCommitsh = tl.getInput('githubTargetCommitsh')

/** Booleans */
const githubReleaseDraft = tl.getBoolInput('githubReleaseDraft')
const githubReleasePrerelease = tl.getBoolInput('githubReleasePrerelease')
const githubReuseRelease = tl.getBoolInput('githubReuseRelease')
const githubReuseDraftOnly = tl.getBoolInput('githubReuseDraftOnly')
const githubSkipDuplicatedAssets = tl.getBoolInput('githubSkipDuplicatedAssets')
const githubIgnoreAssets = tl.getBoolInput('githubIgnoreAssets')

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
  githubEndpointToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN // Or you can set an env var called GITHUB_TOKEN instead
options.owner =
  (githubRepository && githubRepository[0]) ||
  manifestOptions.owner || // If missing, it will be extracted from manifest (the repository.url field)
  undefined
options.repo =
  (githubRepository && githubRepository[1]) ||
  manifestOptions.repo || // If missing, it will be extracted from manifest (the repository.url field)
  undefined
options.tag =
  githubTag ||
  (manifestOptions && `v${manifestOptions.version}`) || // If missing, the version will be extracted from manifest and prepended by a 'v'
  undefined
options.name = githubReleaseTitle || options.tag || undefined // if missing, it will be the same as the tag
options.notes = githubReleaseNotes || undefined // If missing it will be left undefined
options.draft = githubReleaseDraft || false // If missing it's false
options.prerelease = githubReleasePrerelease || false // If missing it's false
options.reuseRelease = githubReuseRelease || true // If you don't want the plugin to create a new release if one already exists for the given tag.
options.reuseDraftOnly = githubReuseDraftOnly || true // If you only want to reuse a release if it's a draft. It prevents you from editing already published releases.
options.assets = githubIgnoreAssets ? undefined : [githubReleaseAsset] // Assets array
options.apiUrl = githubApiUrl || 'https://api.github.com' // Use a custom API URL to connect to GitHub Enterprise instead of github.com.
options.target_commitish = githubTargetCommitsh || 'master' // Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA.
options.skipDuplicatedAssets = githubSkipDuplicatedAssets || false // Prevent the plugin to replace assets with the same name. False by default.
options.skipAssetsCheck = githubIgnoreAssets || false // Don't check if assets exist or not. False by default.

/**
 * Start the release
 * TODO: Release URL only works if it's not draft release (draft doesn't have a tag)
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
 * IF reuseDraftOnly is true and reuseRelease is true, it will not override releases the assets, only drafts
 * IF reuseDraftOnly is false and reuseRelease is true, it will override releases and draft assets
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

release.on('duplicated-asset', (name) => {
  console.log(`Found duplicated asset: ${name}`)
  if (options.skipDuplicatedAssets) {
    console.log('Skipping duplicated asset...')
  } else {
    console.log('Deleting duplicated asset...')
  }
})

release.on('duplicated-asset-deleted', (name) => {
  console.log(`Deleted duplicate asset: ${name}`)
})
