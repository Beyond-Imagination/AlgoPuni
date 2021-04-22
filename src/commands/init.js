import { Command } from 'commander'

import Context from '../lib/context';
import {errorHandler} from '../utils/error';

const init = new Command('init');
init.description('알고푸니 repository 를 생성합니다.')
init.action(async ()=>{
    try {
        const context = new Context('.');
        await context.create();
    } catch (error) {
        errorHandler(error);
    }
})

export default init;
