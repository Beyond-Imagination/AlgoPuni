import { Command } from 'commander'

const solve = new Command('solve');
solve.description('풀이가 완료 된 문제를 동기화합니다');
solve.action(() => {
    console.log('problem solve command');
});

export default solve;
