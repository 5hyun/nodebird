const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        // 원하는 정보만 가져와줌
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// options에 done의 값이 전달된다.
// 로그인은 로그인 안한 사람들이 해야해서 isNotLoggedIn
// next()는 다음 미들웨어로 가는데 isNotLoggedIn의 다음 미들웨어는 (req, res, next)... 이것이다.
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    "local",
    // 미들웨어 확장
    (err, user, info) => {
      // 서버쪽 에러
      if (err) {
        console.error(err);
        return next(err);
      }
      //  클라이언트 에러
      if (info) {
        return res.status(401).send(info.reason);
      }
      //  성공한 경우
      return req.login(
        user,
        // 위 모든 단계를 다 통과하면 passport 로그인을 한번 더 해준다.
        //  에러가 날 확률이 극히 적지만 혹시 모르니 에러 처리를 해줘야한다.
        async (loginErr) => {
          if (loginErr) {
            console.error(loginErr);
            return next(loginErr);
          }
          const fullUserWithoutPassword = await User.findOne({
            where: { id: user.id },
            // 원하는 정보만 가져와줌
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: Post,
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followings",
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followers",
                attributes: ["id"],
              },
            ],
          });
          return res.status(200).json(fullUserWithoutPassword);
        }
      );
    }
  )(req, res, next);
});

// 회원가입도 로그인 안한 사람들이 해서 isNotLoggedIn
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // cors 에러를 해결하기 위해서 아래처럼 적어줄 수 있지만 보통 미들웨어를 사용한다.
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3060");
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 로그아웃은 로그인 한 사람만 할 수 있어서 isLoggedIn
router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
