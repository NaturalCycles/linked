import * as c from 'ansi-colors'
import * as cosmiconfig from 'cosmiconfig'
import * as fs from 'fs-extra'
import { kpy } from 'kpy'

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

const ROOT_DIR = process.cwd()
// const ROOT_DIR = path.join(__dirname, '/../../../../..')
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

async function doLink (moduleName: string, modulePath: string): Promise<void> {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  await fs.emptyDir(srcDir)

  const symlinkTarget = `${modulePath}/src`

  console.log(
    [c.grey('linked'), c.bold.grey(moduleName), c.grey('<'), c.grey(modulePath)].join(' '),
  )

  fs.symlinkSync(symlinkTarget, srcDir)
}

async function doUnlink (moduleName: string): Promise<void> {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  await fs.emptyDir(srcDir)

  console.log(
    [
      c.grey('unlinked'),
      c.bold.grey(moduleName),
      c.grey('<'),
      c.grey(`node_modules/${moduleName}`),
    ].join(' '),
  )

  // cpx.copySync(`${ROOT_DIR}/node_modules/${moduleName}/src/**/*`, srcDir)
  await kpy({
    baseDir: `${ROOT_DIR}/node_modules/${moduleName}/src`,
    outputDir: srcDir,
    silent: true,
  })
}

async function doPostinstall (moduleName: string) {
  const srcDir = `${ROOT_DIR}/src/@linked/${moduleName}`
  await fs.ensureDir(srcDir)

  const exists = await fs.pathExists(srcDir)
  const linked = exists && fs.lstatSync(srcDir).isSymbolicLink()

  // console.log(`${pkg} exists=${exists} linked=${linked}`)

  if (!linked) {
    await doUnlink(moduleName)
  }
}

// todo: use `debug`
