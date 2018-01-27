const fs = require('fs')

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

module.exports = readManifest
