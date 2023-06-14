const express = require("express");
const app = express();
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;
app.use(express.json());
app.use(cors());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const initial = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Running");
    });
  } catch (e) {
    console.log(e.message);
  }
};
initial();
//Api-1
app.post("/register/", async (req, res) => {
  const { username, password, name, gender } = req.body;
  const checkQuery = `select * from user where username ='${username}'`;
  const UsernameCheck = await db.get(checkQuery);
  if (UsernameCheck !== undefined) {
    res.status(400);
    res.send({ message: "User already exists" });
  } else {
    if (password.length < 6) {
      res.status(400);
      res.send({ message: "Password is too short" });
    } else {
      const BPassword = await bcrypt.hash(password, 10);
      const createUserQuery = `
      insert into user(name,username,password,gender)
      values('${name}','${username}','${BPassword}','${gender}');`;
      const createUser = await db.run(createUserQuery);
      res.status(200);
      res.send({ message: "User created successfully" });
    }
  }
});
//Api-2
app.post("/login/", async (req, res) => {
  const { username, password } = req.body;
  const checkQuery = `select * from user where username ='${username}'`;
  const UsernameCheck = await db.get(checkQuery);
  if (UsernameCheck === undefined) {
    res.status(400);
    res.send({ message: "Invalid user" });
  } else {
    console.log(password);
    console.log(UsernameCheck.password);
    const isPassword = await bcrypt.compare(password, UsernameCheck.password);
    if (isPassword === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "Narayana212");
      res.status(200);
      res.send({ jwtToken });
    } else {
      res.status(400);
      res.send({ message: "Invalid password" });
    }
  }
});

const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  console.log(jwtToken);
  if (jwtToken === undefined) {
    res.status(401);
    res.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "Narayana212", async (error, payload) => {
      if (error) {
        res.status(401);
        res.send("Invalid JWT Token");
      } else {
        req.username = payload.username;
        next();
      }
    });
  }
};

//Api-3
app.get("/user/tweets/feed/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  console.log(getID);
  const ID = getID.user_id;
  const getUserFeedQuery = `
  SELECT   u.username as username,t.tweet as tweet ,t.date_time as dateTime
FROM Tweet t 
JOIN Follower f ON t.user_id = f.following_user_id 
JOIN User u ON t.user_id = u.user_id 
WHERE f.follower_user_id = ${ID}
ORDER BY t.date_time DESC 
LIMIT 4;
`;
  const getUserFeed = await db.all(getUserFeedQuery);
  res.send(getUserFeed);
});

//Api-4

app.get("/user/following/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getUserFollowingQuery = `
  SELECT User.name as name
FROM User 
INNER JOIN Follower ON User.user_id = Follower.following_user_id 
WHERE Follower.follower_user_id =${ID};
  `;
  const getUserFollowing = await db.all(getUserFollowingQuery);
  res.send(getUserFollowing);
});

//Api-5
app.get("/user/followers/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getUserFollowersQuery = `
  SELECT u.name
FROM User u
JOIN Follower f ON u.user_id = f.follower_user_id
WHERE f.following_user_id =${ID};
  `;
  const getUserFollowers = await db.all(getUserFollowersQuery);
  res.send(getUserFollowers);
});

//Api-6
app.get("/tweets/:tweetId/", authenticateToken, async (req, res) => {
  const { tweetId } = req.params;
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getUserFollowingQuery = `
  SELECT User.user_id as Id
FROM User 
INNER JOIN Follower ON User.user_id = Follower.following_user_id 
WHERE Follower.follower_user_id =${ID};
  `;
  const getUserFollowing = await db.all(getUserFollowingQuery);
  let getUserFollowingList = [];
  for (let i of getUserFollowing) {
    getUserFollowingList.push(i.Id);
  }
  console.log(getUserFollowingList);
  const UserIdQuery = `select user_id from tweet where tweet_id = ${tweetId}`;
  const UserId = await db.get(UserIdQuery);
  if (getUserFollowingList.includes(UserId.user_id)) {
    const getTweetQuery = `
      SELECT 
  Tweet.tweet AS tweet, 
  COUNT(DISTINCT Like.user_id) AS likes, 
  COUNT(DISTINCT Reply.reply_id) AS replies, 
  Tweet.date_time AS dateTime
FROM 
  Tweet 
  LEFT JOIN Like ON Tweet.tweet_id = Like.tweet_id 
  LEFT JOIN Reply ON Tweet.tweet_id = Reply.tweet_id 
  INNER JOIN User ON Tweet.user_id = User.user_id
  INNER JOIN Follower ON User.user_id = Follower.following_user_id
WHERE 
  Tweet.tweet_id = ${tweetId} AND 
  Follower.follower_user_id = ${UserId.user_id}
GROUP BY 
  Tweet.tweet_id;`;
    const getTweet = await db.get(getTweetQuery);
    res.send(getTweet);
  } else {
    res.status(401);
    res.send("Invalid Request");
  }
});

//Api-7
app.get("/tweets/:tweetId/likes/", authenticateToken, async (req, res) => {
  const { tweetId } = req.params;
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getUserFollowingQuery = `
  SELECT User.user_id as Id
FROM User 
INNER JOIN Follower ON User.user_id = Follower.following_user_id 
WHERE Follower.follower_user_id =${ID};
  `;
  const getUserFollowing = await db.all(getUserFollowingQuery);
  let getUserFollowingList = [];
  for (let i of getUserFollowing) {
    getUserFollowingList.push(i.Id);
  }
  console.log(getUserFollowingList);
  const UserIdQuery = `select user_id from tweet where tweet_id = ${tweetId}`;
  const UserId = await db.get(UserIdQuery);
  if (getUserFollowingList.includes(UserId.user_id)) {
    const getTweetQuery = `
      SELECT 
  Tweet.tweet AS tweet, 
  COUNT(DISTINCT Like.user_id) AS likes, 
  COUNT(DISTINCT Reply.reply_id) AS replies, 
  Tweet.date_time AS dateTime
FROM 
  Tweet 
  LEFT JOIN Like ON Tweet.tweet_id = Like.tweet_id 
  LEFT JOIN Reply ON Tweet.tweet_id = Reply.tweet_id 
  INNER JOIN User ON Tweet.user_id = User.user_id
  INNER JOIN Follower ON User.user_id = Follower.following_user_id
WHERE 
  Tweet.tweet_id = ${tweetId} AND 
  Follower.follower_user_id = ${UserId.user_id}
GROUP BY 
  Tweet.tweet_id;`;
    const getTweet = await db.get(getTweetQuery);
    res.send(getTweet);
  } else {
    res.status(401);
    res.send("Invalid Request");
  }
});

//Api-8
app.get("/tweets/:tweetId/replies/", authenticateToken, async (req, res) => {
  const { tweetId } = req.params;
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getUserFollowingQuery = `
  SELECT User.user_id as Id
FROM User 
INNER JOIN Follower ON User.user_id = Follower.following_user_id 
WHERE Follower.follower_user_id =${ID};
  `;
  const getUserFollowing = await db.all(getUserFollowingQuery);
  let getUserFollowingList = [];
  for (let i of getUserFollowing) {
    getUserFollowingList.push(i.Id);
  }
  console.log(getUserFollowingList);
  const UserIdQuery = `select user_id from tweet where tweet_id = ${tweetId}`;
  const UserId = await db.get(UserIdQuery);
  if (getUserFollowingList.includes(UserId.user_id)) {
    const getTweetQuery = `
      SELECT 
  Tweet.tweet AS tweet, 
  COUNT(DISTINCT Like.user_id) AS likes, 
  COUNT(DISTINCT Reply.reply_id) AS replies, 
  Tweet.date_time AS dateTime
FROM 
  Tweet 
  LEFT JOIN Like ON Tweet.tweet_id = Like.tweet_id 
  LEFT JOIN Reply ON Tweet.tweet_id = Reply.tweet_id 
  INNER JOIN User ON Tweet.user_id = User.user_id
  INNER JOIN Follower ON User.user_id = Follower.following_user_id
WHERE 
  Tweet.tweet_id = ${tweetId} AND 
  Follower.follower_user_id = ${UserId.user_id}
GROUP BY 
  Tweet.tweet_id;`;
    const getTweet = await db.get(getTweetQuery);
    res.send(getTweet);
  } else {
    res.status(401);
    res.send("Invalid Request");
  }
});
//Api-9
app.get("/user/tweets/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const getTweetQuery = `
    SELECT  
      t.tweet,  
      COUNT(DISTINCT l.like_id) AS likes, 
      COUNT(DISTINCT r.reply_id) AS replies,
      t.date_time as dateTime
    FROM 
      Tweet t 
      LEFT JOIN Like l ON t.tweet_id = l.tweet_id 
      LEFT JOIN Reply r ON t.tweet_id = r.tweet_id 
    WHERE 
      t.user_id = ${ID} 
    GROUP BY 
      t.tweet_id`;
  const getTweet = await db.all(getTweetQuery);

  if (getTweet.length === 0) {
    res.send("No tweets found.");
  } else {
    res.status(200).send(getTweet);
  }
});

//Api-10
app.post("/user/tweets/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const tweet = req.body.tweet;
  const createTweetQuery = `
  insert into tweet (tweet,user_id,date_time)
  values('${tweet}',${ID},'${new Date()}');`;
  await db.run(createTweetQuery);
  res.send({ message: "Created a Tweet" });
});
//Api-11
app.delete("/tweets/:tweetId/", authenticateToken, async (req, res) => {
  const getIDQuery = `select user_id from user where username = '${req.username}'`;
  const getID = await db.get(getIDQuery);
  const ID = getID.user_id;
  const { tweetId } = req.params;
  const getQuery = `select user_id from tweet where tweet_id =${tweetId}`;
  const I = await db.get(getQuery);
  console.log(I);
  console.log(ID);
  if (ID != I.user_id || I.user_id === undefined) {
    res.status(401);
    res.send("Invalid Request");
  } else {
    const DeleteQuery = `
      delete from tweet where tweet_id= ${tweetId}`;
    await db.run(DeleteQuery);
    res.send("Tweet Removed");
  }
});
// Api-12
app.get("/tweets/", authenticateToken, async (req, res) => {
  const getAllTweetsQuery = `
    SELECT  
      t.tweet,  
      COUNT(DISTINCT l.like_id) AS likes, 
      COUNT(DISTINCT r.reply_id) AS replies,
      t.date_time AS dateTime,
      u.username AS username
    FROM 
      Tweet t 
      LEFT JOIN Like l ON t.tweet_id = l.tweet_id 
      LEFT JOIN Reply r ON t.tweet_id = r.tweet_id
      INNER JOIN User u ON t.user_id = u.user_id
    GROUP BY 
      t.tweet_id, u.username
    ORDER BY
      t.date_time DESC`;
  const getAllTweets = await db.all(getAllTweetsQuery);

  if (getAllTweets.length === 0) {
    res.send("No tweets found.");
  } else {
    res.status(200).send(getAllTweets);
  }
});


// Api-13: Search users

// Api-13: Search users
app.post("/search/", authenticateToken, async (req, res) => {
  const { query } = req.body;
  const searchQuery = `
    SELECT name, username
    FROM User
    WHERE name LIKE '%${query}%'
       OR username LIKE '%${query}%';
  `;
  const searchResults = await db.all(searchQuery);
  res.send(searchResults);
});

module.exports = app;
