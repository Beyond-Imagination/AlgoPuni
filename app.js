import { Command, Option } from 'commander'
import log from 'loglevel'

import { VERSION } from './params'
import init from'./commands/init'

log.setLevel("info")

const program = new Command();
program.version(VERSION);

program.on('option:debug', function () {
    log.setLevel("debug")
});

program.addOption(new Option('-d, --debug').hideHelp())

program.addCommand(init);
program.command('user', "user command description", { executableFile: './commands/user/index' })
program.command('problem', "problem command description", { executableFile: './commands/problem/index' })

export default program;