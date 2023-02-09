import axios from "axios";
import {
  all,
  fork,
  delay,
  put,
  takeLatest,
  throttle,
  call,
} from "redux-saga/effects";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  generateDummyPost,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortId from "shortid";

function addPostAPI(data) {
  return axios.post("/post", { content: data });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    const id = shortId.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get("/api/post");
}

function* loadPosts(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.post("/api/post", data);
}

function* removePost(action) {
  try {
    // const result = yield call(removePostAPI, action.data);
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  //  throttle는 takeLatest의 단점을 보완해해 시간을 걸어두고 그 시간 안에는 요청을 1번만 보낼 수 있다.
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchLoadPost() {
  //  throttle는 takeLatest의 단점을 보완해해 시간을 걸어두고 그 시간 안에는 요청을 1번만 보낼 수 있다.
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchRemovePost() {
  //  throttle는 takeLatest의 단점을 보완해해 시간을 걸어두고 그 시간 안에는 요청을 1번만 보낼 수 있다.
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  //  throttle는 takeLatest의 단점을 보완해해 시간을 걸어두고 그 시간 안에는 요청을 1번만 보낼 수 있다.
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
