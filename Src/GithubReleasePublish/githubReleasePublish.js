import readManifest from 'CommonNode/readManifest.js'
import bytesToSize from 'CommonNode/bytesToSize.js'
import objectDifference from 'CommonNode/objectDifference.js'

let editObject

const glob = require('glob')
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
const githubEditRelease = tl.getBoolInput('githubEditRelease')
const githubDeleteEmptyTag = tl.getBoolInput('githubDeleteEmptyTag')

/** Paths */
const manifestJson = tl.getPathInput('manifestJson')
let githubReleaseAsset = tl.getPathInput('githubReleaseAsset')

/** Check for options in manifest if they don't exists on input */
const manifestOptions = readManifest(manifestJson)

/** Check for one or multiples files into array
 *  Accept wildcards to look for files
 */
if (githubReleaseAsset && !githubIgnoreAssets) {
  githubReleaseAsset = glob.sync(githubReleaseAsset)
}

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
options.draft = !!githubReleaseDraft // If missing it's false
options.prerelease = !!githubReleasePrerelease // If missing it's false
options.reuseRelease = !!githubReuseRelease // If you don't want the plugin to create a new release if one already exists for the given tag.
options.reuseDraftOnly = !!githubReuseDraftOnly // If you only want to reuse a release if it's a draft. It prevents you from editing already published releases.
options.assets = githubIgnoreAssets ? undefined : githubReleaseAsset // Assets array
options.apiUrl = githubApiUrl || 'https://api.github.com' // Use a custom API URL to connect to GitHub Enterprise instead of github.com.
options.target_commitish = githubTargetCommitsh || 'master' // Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA.
options.skipDuplicatedAssets = !!githubSkipDuplicatedAssets // Prevent the plugin to replace assets with the same name. False by default.
options.skipAssetsCheck = !!githubIgnoreAssets // Don't check if assets exist or not. False by default.
options.editRelease = !!githubEditRelease // Allow to edit release name, notes, type and target_commitsh
options.deleteEmptyTag = !!githubDeleteEmptyTag // Delete tag if it's editing from prerelease or release to draft

/**
 * Start the release
 */
const release = publishRelease(options, (err, release) => {
  if (err) {
    tl.setResult(tl.TaskResult.Failed, `An error occured, log returned: \n${err}`)
  }
  // Url of draft release doesn't exist
  if (release && release.url && !release.draft) {
    console.log(`Finish - Release URL: ${release.url}`)
  } else {
    console.log(`Finish draft release`)
  }
})

release.on('error', existingError => {
  tl.setResult(tl.TaskResult.Failed, `An error occured, log returned: \n${existingError}`)
})

release.on('create-release', () => {
  console.log('Creating release')
})

/**
 * TODO: dynamic 'github.com' url since you can change API URL with parameters
 */
release.on('created-release', () => {
  if (!options.draft) {
    console.log(
      `Release created successfully at
      https://github.com/${options.owner}/${options.repo}/releases/tag/${options.tag}`
    )
  } else {
    console.log(`Draft release created successfully`)
  }
})

/**
 * TODO: Analyse options to return the correct message, e.g.
 * IF reuseDraftOnly is true and reuseRelease is true, it will not override releases the assets, only drafts
 * IF reuseDraftOnly is false and reuseRelease is true, it will override releases and draft assets
 */
release.on('reuse-release', () => {
  if (options.skipDuplicatedAssets) {
    console.log(`Reuse release - duplicated assets will not be overwrite`)
  } else {
    console.log(`Reuse release - duplicated assets will be overwrite`)
  }
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

release.on('edit-release', (obj) => {
  editObject = obj
  console.log(`Release will be edited: \n name: ${obj.name} \n tag: ${obj.tag_name}`)
})

release.on('edited-release', (newObj) => {
  if (editObject) {
    console.log(`Differences output:`)
    console.log(objectDifference(editObject, newObj))
  }
})

release.on('deleted-tag-release', (name) => {
  console.log(`Deleted tag: ${name}`)
})
