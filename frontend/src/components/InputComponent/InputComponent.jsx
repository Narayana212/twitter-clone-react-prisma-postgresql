import React, { useState } from "react";
import { Avatar, Box, Button, Textarea, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";
import "../Home/Home.css";

export default function InputComponent({ setTweets }) {
  const [content, setContent] = useState("");
  const toast = useToast();
  const jwtToken = Cookies.get("jwt_token");

  const pushTweet = async () => {
    try {
      const tweet = content;
      if (tweet === "") {
        toast({
          title: "Please Type To Tweet",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await fetch("http://localhost:4000/user/tweets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ tweet }),
        });
        if (response.ok) {
          console.log(tweet)
          const data = await response.json();

          toast({
            title: data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setContent(""); // Clear the content of the textarea
        } else {
          console.log("Failed to post tweet.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        gap="5px"
        borderBottomWidth={"1px"}
      >
        <Avatar w={10} h={10} name={localStorage.getItem("username")} />
        <Textarea
          placeholder="What is happening?!"
          borderWidth="0"
          outline="none"
          className="custom-textarea"
          value={content} // Bind textarea value to content state
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <hr />
      </Box>
      <Box textAlign={"right"}>
        <Button
          marginTop={"7px"}
          background="#1D9BF0"
          color={"white"}
          width={"6vw"}
          height={"5vh"}
          borderRadius={"100px"}
          fontWeight={"400"}
          _hover={{
            background: "white",
            color: "#1D9BF0",
          }}
          fontSize={"0.7rem"}
          onClick={pushTweet}
        >
          Tweet
        </Button>
      </Box>
    </Box>
  );
}
