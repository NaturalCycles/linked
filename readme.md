# @naturalcycles/linked

> `npm link` for TypeScript projects.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://circleci.com/gh/NaturalCycles/linked.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/linked)

## Problem

`npm link` is good, but TypeScript projects require a build step (transpilation from
`*.ts` to `*.js`), otherwise your project will use stale `*.js` files.

Running _compile/watch_ in a separate terminal is an extra step, which may fail and
again result in stale .js file being used. One terminal window with watcher needed
for each linked project.

## Solution

You may have your dependencies in 2 modes:

- _unlinked_ mode (default)
- _linked_ mode (similar to `npm link`)

Projects are installed under `/src/@linked`.

In _linked_ mode - symlink is created from the source dir of your project
(e.g `../../SomeProject`).

In _unlinked_ mode - files are copied from `node_modules/SomeProject`.

## API

`yarn linked` - enable _linked mode_

`yarn unlinked` - disable _linked mode_

`yarn linked postinstall` - needs to be called in your project's `postinstall` AND after each `yarn upgrade` of linked project.
