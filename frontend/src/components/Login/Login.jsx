import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";

export default function Login({history}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    const url = "http://localhost:4000/login/";
  
    const data = { username, password };
    setLoading(true);
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const { jwtToken } = responseData;
        Cookies.set("jwt_token", jwtToken,{ expires: 150});
        Cookies.set("username",username)
        history.replace("/")
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast({
            title: errorData.message,
            status: "warning",
            duration: 5000,
            isClosable: true,
          });

      } else {
        // Handle other status codes
        console.log("Unexpected error occurred.");
      }
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };
  
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input type="text" onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button
        isLoading={loading}
        fontWeight={"500"}
        background={"#1D9BF0"}
        color={"white"}
        _hover={{
          background: "white",
          color: "#1D9BF0",
        }}
        onClick={submitHandler}
      >
        Login
      </Button>
    </VStack>
  );
}
