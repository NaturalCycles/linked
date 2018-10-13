/*

yarn linked
yarn linked link
yarn linked unlink
yarn linked postinstall

 */

import * as cosmiconfig from 'cosmiconfig'
import * as cpx from 'cpx'
import * as del from 'del'
import * as fs from 'fs-extra'
import * as path from 'path'
const chalk = require('chalk')

export interface StringMap { [moduleName: string]: string }

export interface LinkedConfig {
  /**
   * moduleName => path, e.g:
   * '@naturalcycles/shared': '<projectDir>/../NCShared',
   */
  linkedProjects: StringMap
}

const ROOT_DIR = path.join(__dirname, '/../../../../..')
console.log({ ROOT_DIR })

const COMMANDS = ['link', 'unlink', 'postinstall']

doWork()
  .then(() => {
    // console.log('linked.ts done')
  })
  .catch(err => {
    console.error((err && err.message) || err)
    process.exit(1)
  })

async function doWork () {
  const explorer = cosmiconfig('linked')
  const r = await explorer.search()
  if (!r) {
    throw new Error('linked.config.js not found!')
  }

  console.log({ config: r.config })

  const { linkedProjects } = r.config as LinkedConfig

  const [, , cmd = 'link'] = process.argv

  if (cmd === 'postinstall') {
    await doPostinstallAll(linkedProjects)
  } else if (cmd === 'link') {
    await doLinkAll(linkedProjects)
  } else if (cmd === 'unlink') {
    await doUnlinkAll(linkedProjects)
  } else {
    throw new Error(`Allowed commands: ${COMMANDS.join(', ')}`)
  }
}

async function doPostinstallAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doPostinstall(m)))
}

async function doLinkAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doLink(m, linkedProjects[m])))
}

async function doUnlinkAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doUnlink(m)))
}

async function doLink (moduleName: string, modulePath: string) {
  const srcFile = `${ROOT_DIR}/@linked/${moduleName}/src`
  const exists = await fs.pathExists(srcFile)
  if (exists) {
    // console.log(`del ${srcFile}`)
    del.sync(srcFile)
  }

  const symlinkTarget = `${modulePath}/src`
  // console.log(`${srcFile} ${chalk.grey('>>link')} ${symlinkTarget}`)
  console.log(`${chalk.bold.grey(moduleName)} ${chalk.grey('linked')}`)

  fs.symlinkSync(symlinkTarget, srcFile)
}

async function doUnlink (moduleName: string) {
  const srcFile = `${ROOT_DIR}/@linked/${moduleName}/src`
  const exists = await fs.pathExists(srcFile)
  if (exists) {
    // console.log(`del ${srcFile}`)
    del.sync(srcFile)
  }

  const dest = `${ROOT_DIR}/@linked/${moduleName}/src`
  // console.log(`/node_modules/${pkg}/src ${chalk.grey('>>copy')} ${dest}`)
  console.log(`${chalk.bold.grey(moduleName)} ${chalk.grey('unlinked')}`)

  cpx.copySync(`${ROOT_DIR}/node_modules/${moduleName}/src/**/*`, dest)
}

async function doPostinstall (moduleName: string) {
  const srcFile = `${ROOT_DIR}/@linked/${moduleName}/src`
  const exists = await fs.pathExists(srcFile)
  let linked = false

  if (exists) {
    linked = fs.lstatSync(srcFile).isSymbolicLink()
  }

  // console.log(`${pkg} exists=${exists} linked=${linked}`)

  if (!linked) {
    await doUnlink(moduleName)
  }
}

// todo: use `debug`
