import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import Context from '../lib/context';

const init = new Command('init');
init.description('init command description')
init.action(async ()=>{
    try {
        const context = new Context('.');
        await context.create();
    } catch (error) {
        console.error(error.message)
    }
})

export default init;
