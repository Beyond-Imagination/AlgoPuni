import { Command } from 'commander'

import add from './add';
import challenge from './challenge'
import update from './update';
import unsolved from './unsolved';

const user = new Command('');

user.addCommand(add);
user.addCommand(update);
user.addCommand(unsolved);
user.addCommand(challenge);

user.parse(process.argv);

export default user;
