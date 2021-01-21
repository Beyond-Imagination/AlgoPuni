import { Command } from 'commander'

const init = new Command('init');
init.description('init command description')
init.action(()=>{
    console.log("init command");
})

export default init;
