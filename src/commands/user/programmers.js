import { Command } from 'commander';

import Context from '../../lib/context';
import {errorHandler} from '../../utils/error';

const programmers = new Command('programmers');
programmers.description('사용자의 programmers ID,PW를 업데이트합니다.');
programmers.action(async() => {
    try {
        const context = new Context();
        context.read();

        let accountInfo;
        accountInfo = await context.user.askProgrammersAccount();

        context.user.programmers = accountInfo;
        context.write();

    } catch (error) {
        errorHandler(error);
    }
});

export default programmers;
