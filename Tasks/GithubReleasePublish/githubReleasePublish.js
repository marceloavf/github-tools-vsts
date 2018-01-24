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
 * Read a manifest file and return the repository url with
 * Url [0], Owner [1] and Repo [2] in array
 * @param {*} file => .json file
 */
const readManifest = file => {
  const isJson = path => /^(.*\.json$).*$/.test(path)
  if (isJson(file)) {
    const fileContent = JSON.parse(fs.readFileSync(file))
    const repository =
      fileContent &&
      fileContent.repository &&
      /github\.com:?\/?([\w-]+)\/([\w-]+)/.exec(fileContent.repository.url)
    return repository
  }
  return false
}

/** Check for options in manifest if they don't exists on input */
const manifestOptions = readManifest(manifestJson)

const options = {
  token: githubEndpointToken, // or you can set an env var called GITHUB_TOKEN instead
  owner:
    (githubRepository && githubRepository[0]) ||
    manifestOptions[1] || // if missing, it will be extracted from manifest (the repository.url field)
    undefined,
  repo:
    (githubRepository && githubRepository[1]) ||
    manifestOptions[2] || // if missing, it will be extracted from manifest (the repository.url field)
    undefined,
  tag: githubTag, // if missing, the version will be extracted from manifest and prepended by a 'v'
  name: githubReleaseTitle, // if missing, it will be the same as the tag
  notes: githubReleaseNotes || '', // if missing it will be left undefined
  draft: githubReleaseDraft, // if missing it's false
  prerelease: githubReleasePrerelease, // if missing it's false
  reuseRelease: true, // if you don't want the plugin to create a new release if one already exists for the given tag.
  reuseDraftOnly: true, // if you only want to reuse a release if it's a draft. It prevents you from editing already published releases.
  assets: [githubReleaseAsset], // assets array
  apiUrl: 'https://api.github.com' // Use a custom API URL to connect to GitHub Enterprise instead of github.com.
}

const release = publishRelease(options, (err, release) => {
  if (err) {
    tl.debug(err)
  }
  tl.debug(release)
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
  tl.debug(`Uploading asset ${name} - ${progress}`)
})
