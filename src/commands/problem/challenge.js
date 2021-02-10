import { Command } from 'commander'

const challenge = new Command('challenge');
challenge.description('problem challenge description');
challenge.action(() => {
    console.log('problem challenge command');
});

export default challenge;
