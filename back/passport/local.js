const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        // req.body.email, req.body.password를 설정한다.
        // 만약 req.body.id먄 id라고 해주는게 좋다.
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // 로그인 전략
          //  email 있는지 검사
          const user = await User.findOne({
            where: { email },
          });

          // 이메일 없는 경우
          if (!user) {
            //  passport에서는 응답을 보내주지 않고 done으로 결과를 판단해줌
            // done(서버 에러, 성공, 클라이언트 에러) 이런식으로 사용한다.
            return done(null, false, { reason: "존재하지 않는 사용자입니다!" });
          }

          // 이메일 있으면 비밀번호 확인
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
