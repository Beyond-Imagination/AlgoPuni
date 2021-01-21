import { Command } from 'commander'

const update = new Command('update');
update.description('problem update description');
update.action(() => {
    console.log('problem update command');
});

export default update;
