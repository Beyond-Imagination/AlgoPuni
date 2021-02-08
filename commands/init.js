import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import {createDataJson} from '../utils/data/data';
import {createUserJson} from '../utils/data/user';

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    createRepository();
    createDataJson('.');
    createUserJson('.');
})

export default init;
