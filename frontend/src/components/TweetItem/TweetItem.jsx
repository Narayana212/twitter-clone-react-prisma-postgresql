import { Avatar, Box, Icon, Text } from "@chakra-ui/react";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { AiOutlineHeart,AiFillHeart } from "react-icons/ai";

import React, { useState } from "react";

function TweetItem({ tweet, date_time,username }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      margin={"7px"}
      borderWidth={"1px"}
      gap={"5px"}
      padding={"10px"}
      alignItems={"start"}
      justifyContent={"space-between"}
      borderRadius={"10px"}
    >
      <Box display={"flex"} gap={"5px"} padding={"10px"}>
        <Avatar name={username} />
        <Box>
          <Text fontWeight={"500"}>{username}</Text>
          <Text fontSize={"0.5rem"}>{getCurrentDateTime()}</Text>
          <Text> {tweet} </Text>
        </Box>
      </Box>
      <Box gap={"20px"} display={"flex"}>
        <Box gap={"5px"} display={"flex"} className="icon">
          <Icon as={FaRegComment} />
          <Text fontSize={"0.7rem"}>100</Text>
        </Box>
        <Box gap={"5px"} display={"flex"} className="icon-1">
          {isLiked?<Icon as={AiFillHeart} onClick={handleLike} color={"#f91880"} />:<Icon as={AiOutlineHeart} onClick={handleLike}  />}
          <Text fontSize={"0.7rem"}>100</Text>
        </Box>
        <Box gap={"5px"} display={"flex"} className="icon">
          <Icon as={FaRetweet} />
          <Text fontSize={"0.7rem"}>500</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default TweetItem;
