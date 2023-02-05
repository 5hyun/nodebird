const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  // 세션에 모든 정보를 들고 있으면 버거우니까 유저 id만 따로 저장
  // 유저 정보중에서 쿠키랑 묶어줄 id만 저장하는 것
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 유저 id를 이용해서 데이터를 db에서 불러오는 것
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
