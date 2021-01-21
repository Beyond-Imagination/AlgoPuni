import { Command } from 'commander'

const solve = new Command('solve');
solve.description('problem solve description');
solve.action(() => {
    console.log('problem solve command');
});

export default solve;
