import { Command } from 'commander'

import Context from '../../lib/context';
import Executor from '../../lib/executor';
import log from '../../utils/log'

const exec = new Command('exec');
exec.description('problem exec description');
exec.action(async () => {
    try {
        const context = new Context();
        context.read();
        
        const executor = new Executor(context);
        await executor.exec();
    } catch(err) {
        log.error(err.message)
    }
});

export default exec;
