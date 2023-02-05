import { all, fork } from "redux-saga/effects";
import axios from "axios";
import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL = "http://localhost:3065";

//thunk에서는 비동기 actionCreator을 직접 실행했지만 saga에서는 비동기 actionCreator가 이벤트 리스너 같은 역할을 한다.

export default function* rootSaga() {
  //  all 안에는 개발자가 넣고싶은 비동기 action들을 넣어준다. 안에 있는 모든 함수를 실행시켜준다.
  //  fork는 함수를 실행하는 것, call로 대체할 수 있지만 차이점이 있다.
  //  fork는 비동기 함수 호출, call은 동기 함수 호출
  yield all([fork(postSaga), fork(userSaga)]);
}
