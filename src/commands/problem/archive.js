import { Command } from 'commander'

const archive = new Command('archive');
archive.description('모두가 푼 문제를 따로 저장합니다.');
archive.action(() => {
    console.log('problem archive command');
});

export default archive;
