module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // mysql에는 users 테이블 생성
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    // 나를 팔로우 하는 사람들을 찾는 관계
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    // 내가 팔로우하는 사람들을 찾으려면 나를 먼저 찾아야됨
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
