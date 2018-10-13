#!/usr/bin/env node

/*

yarn linked
yarn unlinked
yarn linked link
yarn linked unlink
yarn linked postinstall

*/

import {
  COMMANDS,
  doLinkAll,
  doPostinstallAll,
  doUnlinkAll,
  readConfig,
} from '@src/util/linked.util'

doWork().catch(err => {
  console.error((err && err.message) || err)
  process.exit(1)
})

async function doWork () {
  const { linkedProjects } = await readConfig()

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
