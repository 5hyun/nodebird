import React, { useState } from "react";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

// 모든 페이지에서 공통인 것은 _app.js에 넣고, 특정 컴포넌트끼리 공통인 것은 AppLayout.js에 넣는다.
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {/*컬럼 사이에 간격을 주는 것이 gutter*/}
      <Row gutter={8}>
        {/*xs: 모바일, sm: 테블릿, md: 작은 데스크탑*/}
        {/*xs인 24가 전체이다. 따라서 md에서는 25%만 차지하겠다는 의미*/}
        {/*만약 Col 2개를 같이 가로로 두고 싶으면 두 Col의 xs 합을 24 이하로 둬야한다.*/}
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://shortcoding.tistory.com/"
            target={"_blank"}
            // 밑에 걸 해줘야 새창에서 띄울 때 보안상 안전하다
            rel={"_noreferrer noopener"}
          >
            made by 5hyun
          </a>
        </Col>
      </Row>
    </div>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;

// 리액트에서 리렌더링이 되면 return 부분을 처음부터 실행하지만 바뀐 부분만 다시 그린다.
// return 부분이 virtual dom이다.
