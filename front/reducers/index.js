import { HYDRATE } from "next-redux-wrapper";

import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

const initialState = {
  user: {},
  post: {},
};

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      // ssr을 위한 HYDRATE
      case HYDRATE:
        return { ...state, ...action.payload };
      //  reducer를 초기화할때도 switch문이 실행되는데 default가 없으면 return 값이 없어서 에러가 난다.
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
