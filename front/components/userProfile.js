import React, { useCallback } from "react";
import { Card, Avatar, Button } from "antd";
import {useDispatch} from "react-redux";
import {logoutAction} from "../reducers/user";

const UserProfile = () => {
    const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction())
  }, []);

  return (
    <Card
      // 리엑트에서 배열로 jsx 쓸 때는 key를 붙어야 함
      actions={[
        <div key={"twit"}>
          짹짹
          <br />0
        </div>,
        <div key={"followings"}>
          팔로잉
          <br />0
        </div>,
        <div key={"followers"}>
          팔로워
          <br />0
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>ZC</Avatar>} title={"ZeroCho"} />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
