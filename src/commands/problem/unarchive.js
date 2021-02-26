import { Command } from 'commander'

const unarchive = new Command('unarchive');
unarchive.description('다 풀어서 따로 저장해둔 문제를 다시 불러옵니다');
unarchive.action(() => {
    console.log('problem unarchive command');
});

export default unarchive;
