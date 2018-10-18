import * as cosmiconfig from 'cosmiconfig'
import * as cpx from 'cpx'
import * as del from 'del'
import * as fs from 'fs-extra'
import * as path from 'path'
const chalk = require('chalk')

export interface StringMap {
  [moduleName: string]: string
}

export interface LinkedConfig {
  /**
   * moduleName => path, e.g:
   * '@naturalcycles/shared': '<projectDir>/../NCShared',
   */
  linkedProjects: StringMap
}

export const ROOT_DIR = path.join(__dirname, '/../../../../..')
// console.log({ ROOT_DIR })

export const COMMANDS = ['link', 'unlink', 'postinstall']

export async function readConfig (): Promise<LinkedConfig> {
  const explorer = cosmiconfig('linked')
  const r = await explorer.search()
  if (!r) {
    throw new Error('linked.config.js not found!')
  }

  // console.log({ config: r.config })

  return r.config as LinkedConfig
}

export async function doPostinstallAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doPostinstall(m)))
}

export async function doLinkAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doLink(m, linkedProjects[m])))
}

export async function doUnlinkAll (linkedProjects: StringMap) {
  await Promise.all(Object.keys(linkedProjects).map(m => doUnlink(m)))
}

async function doLink (moduleName: string, modulePath: string) {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  const srcFile = `${srcDir}/src`
  await fs.ensureDir(srcDir)

  const exists = await fs.pathExists(srcFile)
  if (exists) {
    // console.log(`del ${srcFile}`)
    del.sync(srcFile)
  }

  const symlinkTarget = `${modulePath}/src`

  console.log(
    [
      chalk.grey('linked'),
      chalk.bold.grey(moduleName),
      chalk.grey('<'),
      chalk.grey(modulePath),
    ].join(' '),
  )

  fs.symlinkSync(symlinkTarget, srcFile)
}

async function doUnlink (moduleName: string) {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  const srcFile = `${srcDir}/src`
  await fs.ensureDir(srcDir)

  const exists = await fs.pathExists(srcFile)
  if (exists) {
    // console.log(`del ${srcFile}`)
    del.sync(srcFile)
  }

  const dest = `${ROOT_DIR}/src/@linked/${moduleName}/src`

  console.log(
    [
      chalk.grey('unlinked'),
      chalk.bold.grey(moduleName),
      chalk.grey('<'),
      chalk.grey(`node_modules/${moduleName}`),
    ].join(' '),
  )

  cpx.copySync(`${ROOT_DIR}/node_modules/${moduleName}/src/**/*`, dest)
}

async function doPostinstall (moduleName: string) {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  const srcFile = `${srcDir}/src`
  await fs.ensureDir(srcDir)

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
