#!/usr/bin/env node

/*

yarn linked
yarn unlinked
yarn linked link
yarn linked unlink
yarn linked postinstall

*/

import 'loud-rejection/register'
import { COMMANDS, doLinkAll, doPostinstallAll, doUnlinkAll, readConfig } from '../util/linked.util'

void doWork()

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
