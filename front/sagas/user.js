import axios from "axios";
import { all, fork, delay, put, takeLatest, call } from "redux-saga/effects";
import {
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from "../reducers/user";

function logInAPI(data) {
  // 이런식으로 로그인 요청을 보낼 수 있다.
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    //  call을 사용하면 특이하게 인수를 펼쳐줘야한다.
    //  로그인 요청의 결과값
    // const result = yield call(logInAPI, action.data);

    //  서버가 없을때 사용하는 임시 코드, 비동기라 더미 데이터 같은 효과를 줄 수 있다.
    yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    //  put는 dispatch라고 생각하면된다.
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("http://localhost:3065/user", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.post("/api/login", data);
}

function* follow(action) {
  try {
    // const result = yield call(followAPI);
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.post("/api/login", data);
}

function* unfollow(action) {
  try {
    // const result = yield call(unfollowAPI);
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
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
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
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
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
