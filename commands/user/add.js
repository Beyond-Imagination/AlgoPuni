import { Command } from 'commander'

const add = new Command('add');
add.description('problem add description');
add.action(() => {
    console.log('problem add command');
});

export default add;
