import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import "./LoginRegister.css"; // Assuming you have a separate CSS file for styling
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";

function LoginRegister({history}) {
  return (
    <div className="loginRegister">
      <Tabs
        isFitted
        variant="enclosed"
        width="30vw"
        borderWidth={"1px"}
        borderRadius={"5px"}
        background={"white"}
      >
        <TabList mb="1em">
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login history={history} />
          </TabPanel>
          <TabPanel>
            <SignUp/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default LoginRegister;

        