import { Box, Text } from "@chakra-ui/react";
import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";

import InputComponent from "../InputComponent/InputComponent";
import CenterSideBar from "../CenterSideBar/CenterSideBar";


function Header({ setTweets }) {
  return (
    <Box
      position={"sticky"}
      top={"0"}
      backgroundColor={"rgba(255, 255, 255, 0.9)"}
      zIndex={999}

    >
      Home
      <Tabs variant="unstyled" isFitted>
        <TabList>
          <Tab borderBottomWidth={"1px"}>For you</Tab>
          <Tab borderBottomWidth={"1px"}>Following</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="5px"
          bg="#1D9BF0"
          borderRadius="5px"
        />
        <Box position="relative">
          <TabPanels>
            <TabPanel>
              <InputComponent />
              
            </TabPanel>
            <TabPanel>
              <InputComponent/>
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Box>
  );
}

export default Header;
