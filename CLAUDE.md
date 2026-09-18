# todo-app

React + TypeScript + Vite로 만든 할일 관리 앱. 우선순위(중요 토글), 마감 날짜/시간(AM·PM, 10분 단위), 드래그 앤 드롭 순서 변경, 마감 5분 전 브라우저 알림, PWA(설치형 위젯)를 지원한다.

## 명령어

```bash
npm run dev       # 개발 서버 (기본 포트 5173)
npm run build     # 타입 체크 + 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과물 미리보기
```

빌드 후에는 반드시 `npm run build`까지 실행해야 위젯(설치된 앱)에도 반영된다.

## 위젯 배포

- `start-server.bat` : `npm run preview`를 4174 포트로 실행 (Node 경로를 직접 지정해 PATH 문제 회피)
- `launch-widget.vbs` : 서버를 백그라운드로 띄운 뒤 Edge를 `--app` 모드로 열어 주소창 없는 독립 창으로 표시
- Windows 시작프로그램 폴더(`shell:startup`)에 `launch-widget.vbs` 등록되어 있어 로그인 시 자동 실행됨
- 서비스워커는 `skipWaiting` + `clientsClaim` 설정으로 새 배포가 빠르게 반영되도록 함 (`vite.config.ts`)

## 구조

```
src/
  types.ts               Todo 타입 (important: boolean, dueAt?, notified?)
  hooks/
    useLocalStorage.ts    상태를 localStorage에 동기화하는 범용 훅
    useDueNotifications.ts 마감 5분 전 알림 스케줄링
  components/
    TodoForm.tsx          할일 추가 폼 (텍스트 + 날짜/시간 + 중요 토글)
    TodoItem.tsx           개별 항목 (드래그 핸들, 완료 체크, 날짜 편집, 중요 토글, 삭제)
    DueTimeInput.tsx       날짜(input[type=date]) + 시/분/AM-PM 커스텀 select 조합
  utils/date.ts            AM/PM 영문 포맷, 지연 여부 계산
  App.tsx                  정렬(완료 여부 → 중요 여부)과 드래그앤드롭 그룹 제한 로직
```

## 정렬 규칙

`normalize()` 함수가 항상 진실의 원천이다: 완료되지 않은 항목이 먼저, 그 안에서 중요(`important: true`) 항목이 먼저. 드래그 앤 드롭은 **같은 완료 상태 + 같은 중요도 그룹 안에서만** 허용한다 (`App.tsx`의 `handleDragEnd`).

## 컨벤션

- 우선순위는 3단계(높음/중간/낮음)가 아니라 **`important: boolean` 단일 플래그**다. 과거 데이터에 `priority` 필드가 남아있을 수 있어 `App.tsx`에서 마이그레이션 처리함 (`priority === 'high'` → `important: true`).
- 네이티브 `<input type="datetime-local">`은 쓰지 않는다 — OS 로캘을 따라가서 분 단위·오전/오후 표시를 커스터마이징할 수 없기 때문에, `DueTimeInput.tsx`처럼 date + select(시/분/AM·PM)를 직접 조합한다.
- CSS는 `:root`에 라이트/다크 토큰을 모두 정의하고 `@media (prefers-color-scheme)` + `[data-theme]`로 대응한다.

## 이 폴더의 다른 파일들 (앱과 무관)

- `weekly-bucket-passport.html` : 별도의 독립형 버킷리스트 체크리스트 (claude.ai 아티팩트로도 배포됨). React 앱 빌드에 포함되지 않음.
- `index.html` : 자기소개 페이지 연습용 정적 파일. Vite dev 서버와 무관하게 파일로 직접 연다.

이 두 파일은 순수 HTML/CSS/JS 단일 파일이며 `npm run build`/`npm run dev`와 관계없다.
