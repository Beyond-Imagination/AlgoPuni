import { Command } from 'commander'

const challenge = new Command('풀고 있는 문제의 정보를 출력합니다');
challenge.description('problem challenge description');
challenge.action(() => {
    console.log('problem challenge command');
});

export default challenge;
