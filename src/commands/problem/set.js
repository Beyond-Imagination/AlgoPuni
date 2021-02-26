import { Command } from 'commander'

const set = new Command('set');
set.description('입력받은 문제번호를 이번주 문제로 지정합니다');
set.action(() => {
    console.log('problem set command');
});

export default set;
