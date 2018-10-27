## @naturalcycles/linked

> `npm link` for TypeScript projects.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://circleci.com/gh/NaturalCycles/linked.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/linked)

## Problem

`npm link` is good, but TypeScript projects require a build step (transpilation from
`*.ts` to `*.js`), otherwise your project will use stale `*.js` files.

Running _compile/watch_ in a separate terminal is an extra step, which may fail and
again result in stale .js file being used. One terminal window with watcher needed
for each linked project.

## Problem 2

Sometimes you want to create a _universal module_, to be consumed by both Node and Browser.

You will have a hard choice to define a **tsconfig compilation target**.

For Node you want it high, e.g `es2018`. You don't want to transpile down e.g `async/await`,
cause it creates weird stacktraces, compared to _native stacktraces_ with `es2018`.

For Browser you want to be safe and transpile down to `es2015` or even `es5` (really?).
This means, e.g transpiling down `async/await` and getting _weird stacktraces_ in Node
as a result.

Isn't it better if you can just publish **source files** (`*.ts` in this case) and let
the **target project** decide how to transpile it?

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
