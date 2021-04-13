import { Command, Option } from 'commander'
import log from './utils/log'
import {version} from '../package.json';

import init from'./commands/init'

const program = new Command();
program.version(version);

program.on('option:debug', () => {
    process.env.LOGLEVEL = "debug";
    log.setLevel("debug");
    log.debug("set log level to debug");
});
program.addOption(new Option('-d, --debug').hideHelp())
program.action(() => program.help());

program.addCommand(init);
program.command('user', "user 명령어에 대한 설명입니다.", { executableFile: './commands/user/index' })
program.command('problem', "problem 명령어에 대한 설명입니다.", { executableFile: './commands/problem/index' })
program.command('thisweek', "thisweek 명령어에 대한 설명입니다. ", { executableFile: './commands/thisweek/index' })

export default program;
