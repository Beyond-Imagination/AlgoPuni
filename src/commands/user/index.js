import { Command } from 'commander'

import add from './add';
import challenge from './challenge'
import update from './update';
import unsolved from './unsolved';
import programmers from './programmers';

const user = new Command('');

user.addCommand(add);
user.addCommand(update);
user.addCommand(unsolved);
user.addCommand(challenge);
user.addCommand(programmers);

user.parse(process.argv);

export default user;
