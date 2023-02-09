import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  // 무한 스크롤
  useEffect(() => {
    function onScroll() {
      // 이 3개를 가장 많이 사용한다.
      // window.scrollY + document.documentElement.clientHeight = document.documentElement.scrollHeight
      // console.log(
      //   //  현재 스크롤을 얼마나 내렸는지
      //   //  맨 아래를 기준이 아니고 맨 위를 기준으로 해서 끝까지 내려도 document.documentElement.scrollHeight와 같지 않음
      //   window.scrollY,
      //   // 브라우저 길이
      //   document.documentElement.clientHeight,
      //   // 스크롤을 다 펼친 총 길이(맨 위부터 아래까지 길이)
      //   document.documentElement.scrollHeight
      // );

      // 맨 밑 300px 위보다 더 많이 내렸으면 데이터 추가로 불러옴
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        // hasMorePost: 불러올 데이터가 있는지
        // loadPostsLoading: 데이터를 추가적으로 불러오고 있는 상황인지
        // 맨 아래에서 300px 위 지점에서는 스크롤 이벤트가 여러번 가게 되는데 데이터를 추가적으로 불러오고 있는 상황이면 또 불러와서는 안된다.
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);

    // addEventListener을 사용할때 return을 해주지 않으면 메모리가 계속 쌓인다.
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
