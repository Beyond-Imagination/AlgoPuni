# AlgoPuni Developer
본 문서는 AlgoPuni 를 개발하는 개발자들을 위한 문서입니다.

## 시작

```
git clone ssh://git@git.jetbrains.space/beyond-imagination/algorithm/AlgoPuni.git
cd AlgoPuni
yarn install
yarn start
```

## 필요 사항

AlgoPuni 실행에 필요한 사항
* node.js v.14.15.1 이상
* yarn 1.22.0 이상

## 사용 라이브러리

AlgoPuni 구현에 사용한 라이브러리
* [commander](https://www.npmjs.com/package/commander)
  * 자바스크립트 cli 프레임워크
* [babel](https://babeljs.io/)
  * 자바스크립트 트랜스컴파일러
* [jsonfile](https://www.npmjs.com/package/jsonfile)
  * JSON 파일 관리 모듈
* [commander.js-error](https://www.npmjs.com/package/commander.js-error)
  * commander.js 전용 에러 출력 모듈

## 배포(추후 작성 예정)

배포 관리는 space npm module 을 이용할 예정입니다.
