import { Command } from 'commander'

import Context from '../../lib/context';
import Executor from '../../lib/executor';
import {errorHandler, ErrorZeroProblemNumber} from '../../utils/error';

const exec = new Command('exec');
exec.description('작성한 코드를 실행합니다.');
exec.action(async () => {
    try {
        const context = new Context();
        context.read();

        if(!context.user.challenging) {
            throw ErrorZeroProblemNumber;
        }
        
        const executor = new Executor(context);
        await executor.exec();
    } catch(error) {
        errorHandler(error);
    }
});

export default exec;
