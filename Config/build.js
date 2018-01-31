'use strict'

const path = require('path')
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

/** Tasks */
const githubReleasePublish = {
  name: 'githubReleasePublish',
  entry: {
    'GithubReleasePublish/githubReleasePublish': path.join(
      __dirname,
      '../Src/GithubReleasePublish/githubReleasePublish.js'
    )
  },
  ...mainConfig
}

/** Tasks to execute */
const tasksExecute = [githubReleasePublish]

if (process.env.BUILD_TARGET === 'clean') clean(true)
else build()

function build () {
  greeting()
  clean()

  const tasks = tasksExecute.map((item) => item.name)
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })

  let results = ''

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    if (process.env.BUILD_TARGET === 'package') {
      console.log(`${okayLog} init ${chalk.yellow('`vsts-build-tools`')}\n`)
    }
    process.exit()
  })

  tasksExecute.forEach((el) => {
    pack(el)
      .then(result => {
        results += result + '\n\n'
        m.success(`${el.name}`)
      })
      .catch(err => {
        m.error(`${el.name}`)
        console.log(`\n  ${errorLog}failed to build tasks ${el.name} process`)
        console.error(`\n${err}\n`)
        process.exit(1)
      })
  })
}

/** Clean the Tasks output folder */
function clean (exit) {
  del.sync(['Tasks/*', '!Tasks/.gitkeep'])
  console.log(`\n${doneLog} Clean output\n`)
  if (exit) {
    process.exit()
  }
}

/** Run webpack as promise */
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

/** Show greeting messages */
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
