import { Command, Option } from 'commander'
import log from './utils/log'
import {version} from '../package.json';

import init from'./commands/init'

const program = new Command();
program.version(version);

program.on('option:debug', () => log.setLevel("debug"));
program.addOption(new Option('-d, --debug').hideHelp())
program.action(() => program.help());

program.addCommand(init);
program.command('user', "user command description", { executableFile: './commands/user/index' })
program.command('problem', "problem command description", { executableFile: './commands/problem/index' })

export default program;
