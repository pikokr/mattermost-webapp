#!/usr/bin/env zx

/* eslint-disable */

import { fileURLToPath } from 'url'
import path from 'path'
import rimraf from 'rimraf'

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..')

const emojisDir = path.join(root, 'images', 'emoji')

echo(`Installing icons to ${emojisDir}`)

await $`git clone https://github.com/twitter/twemoji`

echo('Deleting twemoji repo')

rimraf.sync('twemoji')
