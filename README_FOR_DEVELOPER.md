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
* [mocha](https://mochajs.org/)
  * javascript testing 프레임워크
* [chai](https://www.chaijs.com/)
  * assertion 패키지
* [sinon](https://sinonjs.org/)
  * spy, mocking 프레임워크
* [memfs](https://www.npmjs.com/package/memfs)
  * in-memory 파일시스템 패키지
* [fs-monkey](https://github.com/streamich/fs-monkey)
  * 파일시스템 전용 monkey patch 패키지
* [loglevel](https://www.npmjs.com/package/loglevel)
  * log 패키지

## 디버깅
AlgoPuni 프로젝트는 디버깅을 위한 hidden option 을 제공합니다.
`--debug` 를 사용해 log level 을 조정할 수 있으며 debug level 의 log가 화면에 출력되게 됩니다. 효율적인 디버깅을 위해 필요한 곳에 로그를 많이 남겨주시기 바랍니다.

## 테스트
package.json 에 정의된 `yarn test` 명령어를 이용해 test 를 실행할 수 있습니다.
작성한 코드에 대한 테스트는 필수이니 push 전 꼭 테스트를 진행해주시기 바랍니다.

```shell
yarn test
```

### 테스트 구조
모든 test 코드는 `test` 디렉토리 안에 있습니다. 테스트 디렉토리에는 AlgoPuni 소스코드와 똑같은 디렉토리 구조를 갖는 `*.test.js` 파일들이 존재합니다. 이점 유의하여 테스트 파일을 추가해주시기 바랍니다. 모든 test 파일은 `memfs`와 `fs-monkey`를 이용하여 각각 테스트에 사용할 디렉토리를 생성하고 해당 디렉토리에서 테스트를 진행합니다. 이를 통해 각 파일별 독립된 테스트 환경을 갖게됩니다. 

## 배포(추후 작성 예정)

배포 관리는 space npm module 을 이용할 예정입니다.
