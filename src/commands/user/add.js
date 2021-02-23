import { Command } from 'commander';
import Context from '../../lib/context';
import log from '../../utils/log';

const add = new Command('add');
add.description('add new user. fail when userID is duplicated');
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
        log.error(err.message)
    }
});

export default add;