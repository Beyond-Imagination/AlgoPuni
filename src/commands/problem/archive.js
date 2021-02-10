import { Command } from 'commander'

const archive = new Command('archive');
archive.description('problem archive description');
archive.action(() => {
    console.log('problem archive command');
});

export default archive;
