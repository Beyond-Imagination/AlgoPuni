import { Command } from 'commander'

import add from './add';
import update from './update';
import unsolved from './unsolved';

const user = new Command('');

user.addCommand(add);
user.addCommand(update);
user.addCommand(unsolved);

user.parse(process.argv);

export default user;
