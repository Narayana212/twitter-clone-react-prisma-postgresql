import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import TweetItem from "../TweetItem/TweetItem";

function CenterSideBar() {
  const [tweets, setTweets] = useState([]);

  const jwtToken = Cookies.get("jwt_token");

  const fetchTweets = async () => {
    try {
      const response = await fetch("http://localhost:4000/tweets/", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTweets(data);
        console.log(data)
      } else {
        console.log("fail");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Box
      width={"40vw"}
      height={"auto"}
      borderWidth={"1px"}
      borderLeftWidth={"0px"}
      padding={"10px"}
    >
      <Header setTweets={setTweets} />
      {/* Render tweets here */}
      {tweets.map((tweet, index) => (
        <TweetItem
          key={`${tweet.date_time}-${index}`}
          tweet={tweet.tweet}
          dateTime={tweet.dateTime}
          data={tweets}
          username={tweet.user.username}
        />
      ))}
      {tweets.length === 0 ? (
        <Text textAlign={"center"}>Get Started With Your First Tweet 😊</Text>
      ) : null}
    </Box>
  );
}

export default CenterSideBar;
