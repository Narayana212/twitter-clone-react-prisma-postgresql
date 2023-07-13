import React,{useState}from 'react'
import { Avatar, Box, Button, Icon, Text } from "@chakra-ui/react";
import { AiOutlineTwitter } from "react-icons/ai";
import Cookies from "js-cookie";
import { VscVerified } from "react-icons/vsc";
import {
  RiHome2Line,
  RiCompass3Line,
  RiNotification2Line,
  RiMailLine,
  RiBookmarkLine,
  RiAccountCircleLine,
  RiMoreLine,
} from "react-icons/ri";

function LeftSideBar({props}) {
    const [hoveredItem, setHoveredItem] = useState("");

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    window.location.href="/login-register";
  };
  const handleHover = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem("");
  };

  const isHovered = (item) => {
    return item === hoveredItem;
  };
  return (
    <Box
        width={"20vw"}
        height={"100vh"}
        borderWidth={"1px"}
        borderLeftWidth={"0px"}
        padding={"10px"}
        display={"flex"}
        flexDir={"column"}
      >
        <Icon
          as={AiOutlineTwitter}
          w={7}
          h={7}
          color="#1D9BF0"
          className="logo"
        />
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Home") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Home")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiHome2Line} w={7} h={7} />
          <Text className="left-tab">Home</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Explore") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Explore")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiCompass3Line} w={7} h={7} />
          <Text className="left-tab">Explore</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Notifications") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Notifications")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiNotification2Line} w={7} h={7} />
          <Text className="left-tab">Notifications</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Lists") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Lists")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiMailLine} w={7} h={7} />
          <Text className="left-tab">Lists</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Bookmarks") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Bookmarks")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiBookmarkLine} w={7} h={7} />
          <Text className="left-tab">Bookmarks</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Verified") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Verified")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={VscVerified} w={7} h={7} />
          <Text className="left-tab">Verified</Text>
        </Box>
        <Box
          width={"13vw"}
          h={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("Profile") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Profile")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiAccountCircleLine} w={7} h={7} />
          <Text className="left-tab">Profile</Text>
        </Box>
        <Box
          width={"13vw"}
          height={"7vh"}
          className="tab-left-item"
          marginTop={"10px"}
          display={"flex"}
          gap={"5px"}
          alignItems={"center"}
          borderRadius={"100px"}
          padding={"5px"}
          bg={isHovered("More") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("More")}
          onMouseLeave={handleMouseLeave}
        >
          <Icon as={RiMoreLine} w={7} h={7} />
          <Text className="left-tab">More</Text>
        </Box>
        <Button
          background="#1D9BF0"
          color={"white"}
          width={"15vw"}
          marginTop={"7px"}
          borderRadius={"100px"}
          fontWeight={"400"}
          _hover={{
            background: "white",
            color: "#1D9BF0",
          }}
          onClick={onClickLogout}
        >
          LogOut
        </Button>
        <Box
          display={"flex"}
          gap={"5px"}
          width={"13vw"}
          height={"10vh"}
          alignItems={"center"}
          padding={"5px"}
          bg={isHovered("Profile1") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Profile1")}
          onMouseLeave={handleMouseLeave}
          marginTop={"10px"}
          borderRadius={"100px"}
          className="tab-left-item"
        >
          <Avatar
            w={10}
            h={10}
            name={localStorage.getItem("username")}
          />
          <Box>
            <p className="name">{localStorage.getItem("username")}</p>
            <p className="username">@{localStorage.getItem("name")}</p>
          </Box>
        </Box>
      </Box>
  )
}

export default LeftSideBar