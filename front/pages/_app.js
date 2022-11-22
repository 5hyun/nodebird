import React from "react";
import PropTypes from "prop-types";
// html에서 head를 수정하고 싶을 때
import Head from "next/head";
import "antd/dist/antd.css";

// 모든 페이지에서 공통인 것은 _app.js에 넣고, 특정 컴포넌트끼리 공통인 것은 AppLayout.js에 넣는다.
// Compoent는 index.js의 리턴 부분, 결국 NodeBird가 부모
const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default NodeBird;
