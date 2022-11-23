import { useCallback, useState } from "react";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import styled from "styled-components";
import PropTypes from "prop-types";
import useInput from "../hooks/useInput";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
  const [id, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");

  // 컴포넌트에 props로 넘기는 함수는 useCallback을 써야 최적화가 된다.
  const onSubmitForm = useCallback(
    (e) => {
      console.log(id, password);
      setIsLoggedIn(true);
    },
    [id, password]
  );

  return (
    // antDesign의 onFinish는 preventDefault가 자동 적용되어 있다.
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name={"user-id"} value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name={"user-password"}
          type={"password"}
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      {/* <div style={{ marginTop: 10 }}> 아런식으로 하면 안된다. 왜냐하면 객체 {} === {}는 false라서 리렌더링이 발생한다.*/}
      {/* 성능에 크게 문제가 없다면 인라인 스타일을 써도 되긴한다. */}
      <ButtonWrapper>
        {/* htmlType에 submit을 해줘야 form이 submit이 된다. */}
        <Button type="primary" htmlType={"submit"} loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

LoginForm.prototype = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;
