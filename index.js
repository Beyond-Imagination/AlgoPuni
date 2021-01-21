import { Command } from 'commander'

import { version } from './params'
import init from'./commands/init'

const program = new Command();
program.version(version);

program.addCommand(init);
program.command('user', "user command description", { executableFile: './commands/user/index' })
program.command('problem', "problem command description", { executableFile: './commands/problem/index' })

program.parse(process.argv);