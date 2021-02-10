import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import {createDataJSON, addUser} from '../utils/data/data';
import {createUserJSON} from '../utils/data/user';

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    try {
        createRepository();
        const data = createDataJSON('.');
        const user = createUserJSON('.');
        addUser(data, user, '.')
    } catch (error) {
        console.error(error.message)
    }
})

export default init;
