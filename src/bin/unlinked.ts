#!/usr/bin/env node

/*

yarn unlinked

*/

import { doUnlinkAll, readConfig } from '../util/linked.util'

doWork().catch(err => {
  console.error(err)
  process.exit(1)
})

async function doWork () {
  const { linkedProjects } = await readConfig()
  await doUnlinkAll(linkedProjects)
}
