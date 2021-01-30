import { Command } from 'commander'

import {createRepository} from '../utils/files/repository';
import {createDataJson, createUserJson} from '../utils/files/json';

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    createRepository();
    createDataJson('.');
    createUserJson('.');
})

export default init;
