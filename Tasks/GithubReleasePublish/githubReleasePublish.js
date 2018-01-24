const publishRelease = require('publish-release')
const tl = require('vsts-task-lib/task')
const fs = require('fs')

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

/**
 * Convert bytes to MB, KB, etc.
 * @param {*} bytes
 */
const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

/**
 * Read a manifest file and return necessary items in object
 * @param {*} file => .json file
 * TODO: dynamic 'github.com' url since you can change API URL with parameters
 */
const readManifest = file => {
  const isJson = path => /^(.*\.json$).*$/.test(path)
  if (isJson(file)) {
    let obj = {}
    const fileContent = JSON.parse(fs.readFileSync(file))
    const repo =
      fileContent &&
      fileContent.repository &&
      /github\.com:?\/?([\w-]+)\/([\w-]+)/.exec(fileContent.repository.url)
    obj = { owner: repo[1], repo: repo[2], version: fileContent.version }
    return obj
  }
  return false
}

/** Check for options in manifest if they don't exists on input */
const manifestOptions = readManifest(manifestJson)

/**
 * Set all options
 */
let options = {}
options.token = githubEndpointToken || process.env.GITHUB_TOKEN // or you can set an env var called GITHUB_TOKEN instead
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
  (manifestOptions && `v${manifestOptions.version}`) ||
  undefined // if missing, the version will be extracted from manifest and prepended by a 'v'
options.name = githubReleaseTitle || options.tag || undefined // if missing, it will be the same as the tag
options.notes = githubReleaseNotes || undefined // if missing it will be left undefined
options.draft = githubReleaseDraft // if missing it's false
options.prerelease = githubReleasePrerelease // if missing it's false
options.reuseRelease = true // if you don't want the plugin to create a new release if one already exists for the given tag.
options.reuseDraftOnly = true // if you only want to reuse a release if it's a draft. It prevents you from editing already published releases.
options.assets = [githubReleaseAsset] // assets array
options.apiUrl = 'https://api.github.com' // Use a custom API URL to connect to GitHub Enterprise instead of github.com.

/**
 * Start the release
 */
const release = publishRelease(options, (err, release) => {
  if (err) {
    tl.debug(err)
    return false
  }
  tl.debug(`Finish - Release URL: ${release.url}`)
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
  tl.debug(
    `Release created successfully at
    https://github.com/${options.owner}/${options.repo}/releases/tag/${
  options.tag
}`
  )
})

release.on('reuse-release', () => {
  tl.debug(`Reuse release - the assets will be uploaded to an existing one`)
})

release.on('upload-progress', (name, progress) => {
  tl.debug(
    `Uploading asset ${name} - ${Math.floor(
      progress.percentage
    )}% - ${bytesToSize(progress.speed)}/s`
  )
})
