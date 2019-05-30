#!/usr/bin/env node

/*

yarn unlinked

*/

import 'loud-rejection/register'
import { doUnlinkAll, readConfig } from '../util/linked.util'

void doWork()

async function doWork () {
  const { linkedProjects } = await readConfig()
  await doUnlinkAll(linkedProjects)
}
