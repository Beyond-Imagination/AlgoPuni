import { Command } from 'commander';
import Context from '../../lib/context';
import log from '../../utils/log';

const add = new Command('add');
add.description('입력받은 이름으로 사용자를 생성합니다');
add.arguments('[userID]')
add.action(async (userID) => {
    try {
        const context = new Context();
        context.data.read();

        if (!userID) {
            userID = await context.user.askUserID();
        }
        context.user.userID = userID;

        context.data.addUser(context.user);
        context.user.create(userID);
        context.data.write();
    } catch (err) {
        log.error(err.message);
        process.exit(err.code);
    }
});

export default add;