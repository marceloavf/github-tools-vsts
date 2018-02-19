const { detailedDiff } = require('deep-object-diff')
const pretty = require('js-object-pretty-print').pretty
/**
 * Return detailed differences between two objects
 * @param {*} oldObj
 * @param {*} newObj
 */
const objectDifference = (oldObj, newObj) => {
  const log = detailedDiff(oldObj, newObj)
  return pretty(log, 2)
}

module.exports = objectDifference
