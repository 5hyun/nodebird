import {
  all,
  fork,
  call,
  take,
  put,
  takeEvery,
  takeLatest,
  throttle,
  delay,
} from "redux-saga/effects";
import axios from "axios";

//thunk에서는 비동기 actionCreator을 직접 실행했지만 saga에서는 비동기 actionCreator가 이벤트 리스너 같은 역할을 한다.

function logInAPI(data) {
  // 이런식으로 로그인 요청을 보낼 수 있다.
  return axios.post("/api/login", data);
}

//generator을 사용하면 테스트하기가 쉽다.
const l = logIn({ type: "LOG_IN_REQUEST", data: { id: "zerocho@gmail.com" } });
l.next();
l.next();
// 이런식으로 next()를 이용해서 테스트를 할 수 있다.

function* logIn(action) {
  try {
    //  call을 사용하면 특이하게 인수를 펼쳐줘야한다.
    //  로그인 요청의 결과값
    // const result = yield call(logInAPI, action.data);

    //  서버가 없을때 사용하는 임시 코드, 비동기라 더미 데이터 같은 효과를 줄 수 있다.
    yield delay(1000);
    yield put({
      type: "LOG_IN_SUCCESS",
    });
  } catch (err) {
    //  put는 dispatch라고 생각하면된다.
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post("/api/logout");
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post("/api/post");
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  //  take는 LOG_IN이란 action이 실행될 때 까지 기다리겠다는 의미
  //  LOG_IN이 들어오면 logIn을 실횅한다. 이것이 이벤트 리스너 같은 역할
  //  yield는 일회용이라 while(true)을 써줬는데 이는 너무 복잡해서 takeEvery를 써준다.
  //  takeLatest는 takeEvery와 비슷하지만 사용자가 실수로 로그인 버튼을 여러번 누르면 마지막 요청만 가도록 해줌(앞에 로딩중인게 있으면 없애는 개념)
  //  만약 로그인 버튼을 2번 누르면 프론트에서 백에 요청을 2번 보내고 응답을 1번 받는 것이라 백에서도 관리가 필요하다.
  // 만약 첫번째꺼만 실행하고 싶다면 takeLeading
  yield takeLatest("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
  //  throttle는 takeLatest의 단점을 보완해해 시간을 걸어두고 그 시간 안에는 요청을 1번만 보낼 수 있다.
  yield throttle("ADD_POST_REQUEST", addPost, 2000);
}

export default function* rootSaga() {
  //  all 안에는 개발자가 넣고싶은 비동기 action들을 넣어준다. 안에 있는 모든 함수를 실행시켜준다.
  //  fork는 함수를 실행하는 것, call로 대체할 수 있지만 차이점이 있다.
  //  fork는 비동기 함수 호출, call은 동기 함수 호출
  yield all([fork(watchLogIn), fork(watchLogOut), fork(watchAddPost)]);
}
