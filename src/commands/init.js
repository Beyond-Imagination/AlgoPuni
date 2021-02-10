import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import {Context} from '../context';

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    try {
        createRepository();
        const context = new Context('.');
        context.data.create();
        context.user.create();
        context.addUser()
    } catch (error) {
        console.error(error.message)
    }
})

export default init;
