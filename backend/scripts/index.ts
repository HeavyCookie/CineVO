require('dotenv').config({ path: '../.env' })

import { resolve } from 'path'

import * as glob from 'glob'
import * as R from 'remeda'
import { ArgumentParser } from 'argparse'

const files = R.pipe(
  glob.sync(resolve(__dirname, '**/*.ts')),
  R.reject(x => x == resolve(__filename)),
  R.map(x => x.replace(__dirname + '/', '')),
  R.map(x => x.slice(0, x.length - 3))
)

const parser = new ArgumentParser({
  epilog: 'Available scripts: \n' + files.join('\n'),
})
parser.addArgument(['script'], {
  help: 'Name of the script',
})

const args = parser.parseArgs()

require(`./${args.script}`).default()
