import { Command } from 'commander'

const unsolved = new Command('unsolved');
unsolved.description('problem unsolved description');
unsolved.action(() => {
    console.log('problem unsolved command');
});

export default unsolved;
