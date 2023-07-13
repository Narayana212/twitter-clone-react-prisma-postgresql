const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.post("/register/", async (req, res) => {
  const { username, password, name, gender } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      res.status(400);
      res.send({ message: "User already exists" });
      return;
    }

    if (password.length < 6) {
      res.status(400);
      res.send({ message: "Password is too short" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        gender: gender,
      },
    });

    res.status(200);
    res.send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/login/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!existingUser) {
      res.status(400);
      res.send({ message: "Invalid user" });
      return;
    }

    const isPassword = await bcrypt.compare(password, existingUser.password);

    if (isPassword) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "Narayana212");

      res.status(200);
      res.send({ jwtToken });
    } else {
      res.status(400);
      res.send({ message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
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

app.get("/user/tweets/", authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: req.username,
        },
      });
  
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
  
      const tweets = await prisma.tweet.findMany({
        where: {
          user_id: user.user_id,
        },
        include: {
          likes: {
            select: {
              like_id: true,
            },
          },
          replies: {
            select: {
              reply_id: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          date_time: "desc",
        },
      });
  
      if (tweets.length === 0) {
        res.send("No tweets found.");
      } else {
        res.status(200).send(tweets);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } finally {
      await prisma.$disconnect();
    }
  });
  

app.get("/tweets/", authenticateToken, async (req, res) => {
    try {
      const tweets = await prisma.tweet.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
          likes: true,
          replies: true,
        },
        orderBy: {
          date_time: "desc",
        },
      });
  
      if (tweets.length === 0) {
        res.send("No tweets found.");
      } else {
        res.status(200).send(tweets);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } finally {
      await prisma.$disconnect();
    }
  });
  

app.post("/search/", authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    const searchResults = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            username: {
              contains: query,
            },
          },
        ],
      },
      select: {
        name: true,
        username: true,
      },
    });

    res.send(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/user/tweets/", authenticateToken, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: req.username,
        },
      });
  
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
  
      const tweet = req.body.tweet;
  
      await prisma.tweet.create({
        data: {
          tweet: tweet,
          user: {
            connect: {
              user_id: user.user_id,
            },
          },
          date_time: new Date(),
        },
      });
  
      res.send({ message: "Created a Tweet" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    } finally {
      await prisma.$disconnect();
    }
  });
  