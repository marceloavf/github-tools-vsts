'use strict'

process.env.NODE_ENV = 'production'

const { say } = require('cfonts')
const chalk = require('chalk')
const del = require('del')
const webpack = require('webpack')
const Multispinner = require('multispinner')

const doneLog = chalk.bgGreen.black(' DONE ') + ' '
const errorLog = chalk.bgRed.black(' ERROR ') + ' '
const okayLog = chalk.bgBlue.black(' OKAY ') + ' '
const isCI = process.env.CI || false

/** The main build tasks */
const mainConfig = require('./webpack.config')

if (process.env.BUILD_TARGET === 'clean') clean()
else build()

/** Clean the Tasks output folder */
function clean () {
  del.sync(['Tasks/*', '!Tasks/.gitkeep'])
  console.log(`\n${doneLog}\n`)
  process.exit()
}

function build () {
  greeting()

  const tasks = ['main']
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })

  let results = ''

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    console.log(`${okayLog} init ${chalk.yellow('`vsts-build-tools`')}\n`)
    process.exit()
  })

  pack(mainConfig)
    .then(result => {
      results += result + '\n\n'
      m.success('main')
    })
    .catch(err => {
      m.error('main')
      console.log(`\n  ${errorLog}failed to build tasks main process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    })
}

function pack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err)
      else if (stats.hasErrors()) {
        let err = ''

        stats
          .toString({
            chunks: false,
            colors: true
          })
          .split(/\r?\n/)
          .forEach(line => {
            err += `    ${line}\n`
          })

        reject(err)
      } else {
        resolve(
          stats.toString({
            chunks: false,
            colors: true
          })
        )
      }
    })
  })
}

function greeting () {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 85) text = 'GitHub-tools'
  else if (cols > 60) text = 'GitHub-|tools'
  else text = false

  if (text && !isCI) {
    say(text, {
      colors: ['green'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  GitHub-tools'))
  console.log()
}
