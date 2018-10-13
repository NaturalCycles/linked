#!/usr/bin/env node

/*

yarn unlinked

*/

import { doUnlinkAll, readConfig } from '@src/util/linked.util'

doWork().catch(err => {
  console.error((err && err.message) || err)
  process.exit(1)
})

async function doWork () {
  const { linkedProjects } = await readConfig()
  await doUnlinkAll(linkedProjects)
}
