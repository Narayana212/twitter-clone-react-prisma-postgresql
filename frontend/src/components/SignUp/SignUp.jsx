import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
  } from "@chakra-ui/react";
  import Cookies from "js-cookie";
  import React, { useState } from "react";
  
  
  function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const[gender,setGender]=useState("")
    const[name,setName]=useState("")
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const submitHandler= async()=>{
      const url = "http://localhost:4000/register/";
      const data = { name,username, password,gender };
      Cookies.set("name",name)
      Cookies.set("username",name)
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
            toast({
              title:responseData.message,
              status:"success",
              duration:5000,
              isClosable:true
            })
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
    }
    return (
      <div>
        <VStack>
          <VStack spacing={"5px"}>
          <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Gender</FormLabel>
              <Input
                type="text"
                onChange={(e) => setGender(e.target.value)}
              />
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
              SignUp
            </Button>
          </VStack>
        </VStack>
      </div>
    );
  }
  
  export default SignUp;
  
