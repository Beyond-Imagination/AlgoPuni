# algorithm/AlgoPuni
AlgoPuni는 Beyond_Imagination 팀 멤버들이 알고리즘 문제를 함께 풀기 위해 만드는 툴입니다.

## 시작
```
npm install -g @beyond_imagination/algopuni
```

## 필요 사항

AlgoPuni 실행에 필요한 사항
* node.js v14.15.1 이상

## 명령어
### argument
본 문서에는 다음 방식으로 argument 를 표시합니다.

|타입|표시|
|---|---|
|필수|`<value>`|
|선택|`[value]`|
|배열|`value...`|

### algopuni init
현재 directory 를 algopuni repository 로 만듭니다.
.algopuni directory 가 생성되며 사용자의 ID를 받아 .algopuni/user.json 에 저장합니다.

### algopuni user add [userID]
새로운 유저를 등록합니다. `.algopuni/user.json` 파일이 없을 경우에만 사용할 수 있습니다.

### algopuni user update [newUserID]
유저 ID를 변경합니다. 바꾸려는 유저 ID는 다른 유저의 ID 와 겹치면 안 됩니다.
유저 ID를 변경하면 지금까지 작성했던 모든 solution 파일들의 이름이 새로운 유저 ID 로 바뀌게 됩니다.

### algopuni user challenge
현재 유저가 풀고있는 문제의 정보를 출력합니다.

### algopuni user unsolved
유저가 아직 풀지 않은 문제들을 출력합니다.

### algopuni problem add <problemNumber>
새로운 문제를 추가합니다. 

### algopuni problem challenge <problemNumber>
해당 문제를 풀기 위한 파일을 생성합니다.

### algopuni problem exec
현재 풀고 있는 문제를 실행합니다.

### algopuni problem solve
풀이가 완료 된 문제를 동기화합니다.

### algopuni problem archive <problemNumber...>
모두가 다 푼 문제를 따로 저장합니다.

### algopuni problem unarchive <problemNumber...>
따로 저장한 문제를 다시 불러옵니다.

### algopuni thisweek set <problemNumber...>
이번 주 문제를 설정합니다.

### algopuni thisweek print
이번 주 문제 목록을 출력합니다.