import { Command } from 'commander';

import add from './add';
import challenge from './challenge';
import exec from './exec';
import solve from './solve';
import archive from './archive';
import unarchive from './unarchive';

const problem = new Command();

problem.addCommand(add);
problem.addCommand(challenge);
problem.addCommand(exec);
problem.addCommand(solve);
problem.addCommand(archive);
problem.addCommand(unarchive);

problem.parse(process.argv);

export default problem;
