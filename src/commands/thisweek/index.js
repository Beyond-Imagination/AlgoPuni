import { Command } from 'commander';

import set from './set';

const thisweek = new Command();

thisweek.addCommand(set);

thisweek.parse(process.argv);

export default thisweek;
