import React from "react";
import "./Home.css";
import {Box} from "@chakra-ui/react";
import LeftSideBar from "../LeftSideBar/LeftSideBar";
import CenterSideBar from "../CenterSideBar/CenterSideBar";
import RightSideBar from "../RightSideBar/RightSideBar";

export default function Home(props) {
  
  return (
    <Box
      paddingLeft={"130px"}
      paddingRight={"130px"}
      display={"flex"}
      width={"100vw"}
    >
      <LeftSideBar props={props}/>
      <CenterSideBar/>
      <RightSideBar/>
    </Box>
  );
}
