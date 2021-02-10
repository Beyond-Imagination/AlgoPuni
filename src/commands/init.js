import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import {Data} from '../utils/data/data';
import {User} from '../utils/data/user';

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    try {
        createRepository();
        const data = new Data('.');
        const user = new User('.');
        data.create();
        user.create();
        data.addUser(user)
    } catch (error) {
        console.error(error.message)
    }
})

export default init;
