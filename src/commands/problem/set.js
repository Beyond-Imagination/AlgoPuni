import { Command } from 'commander'

const set = new Command('set');
set.description('problem set description');
set.action(() => {
    console.log('problem set command');
});

export default set;
