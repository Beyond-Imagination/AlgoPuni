import { Command } from 'commander'

const exec = new Command('exec');
exec.description('problem exec description');
exec.action(() => {
    console.log('problem exec command');
});

export default exec;
