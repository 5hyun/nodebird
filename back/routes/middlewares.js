exports.isLoggedIn = (req, res, next) => {
  // 로그인이 된 상태
  if (req.isAuthenticated()) {
    // next는 2가지가 있다.
    //  1. 인자를 주게되면 에러 처리를 하고(에러 처리 미들웨어는 app.js 안의 app.use() 내부적으로 존재한다.
    //  2. 인자가 없으면 다음 미들웨어로 넘어간다.
    next();
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
