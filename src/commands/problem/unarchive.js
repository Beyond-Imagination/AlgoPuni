import { Command } from 'commander'

const unarchive = new Command('unarchive');
unarchive.description('problem unarchive description');
unarchive.action(() => {
    console.log('problem unarchive command');
});

export default unarchive;
