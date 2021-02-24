import { Command } from 'commander'

import Context from '../lib/context';
import log from '../utils/log'

const init = new Command('init');
init.description('init command description')
init.action(async ()=>{
    try {
        const context = new Context('.');
        await context.create();
    } catch (error) {
        log.error(error.message);
    }
})

export default init;
