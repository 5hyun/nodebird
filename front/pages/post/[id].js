import React from "react";
import { useRouter } from "next/router";
import wrapper from "../../store/configureStore";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        {/*  og가 카톡에 공유했을때 뜨는 미리보기 정보 */}
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : "https://nodebird.com/favicon.ico"
          }
        />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // 서버쪽으로 쿠키 전달을 위한 코드
    // 아래 if문를 추가하지 않으면 다른 사람이 내 쿠키를 공유할 수도 있는 문제가 발생한다.
    // 쿠키를 써서 요청을 보낼때 쿠키를 넣어놨다가 쿠키 안써서 요청보낼때는 쿠키를 비워둔다.
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      //  context.params.id 혹은 context.query.id라고 하면 useRouter에 똑같이 접근할 수 있다.
      data: context.params.id,
    });
    // 요청이 Request에서 끝나는게 아니라 SUCCESS에서 받아올 수 있도록 기다리는 코드
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
