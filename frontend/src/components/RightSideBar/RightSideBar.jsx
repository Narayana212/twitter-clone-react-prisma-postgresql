import { Avatar, Box, Icon, Input } from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";

function RightSideBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hoveredItem, setHoveredItem] = useState("");

  const filteredSearchResults = searchResults.filter(
    (result) => result.username !== "lanja" && result.username !== "lanja1"
  );

  const searchRes = filteredSearchResults.slice(0, 4);

  const jwtToken = Cookies.get("jwt_token");

  const handleHover = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem("");
  };

  const isHovered = (item) => {
    return item === hoveredItem;
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.log("Failed to fetch search results.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Call the search API when the searchQuery changes
    handleSearch();
  }, [searchQuery]);

  return (
    <Box padding={"10px"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"7px"}
        borderWidth={"1px"}
        padding={"10px"}
        borderRadius={"100px"}
        height={"30px"}
        background={"#EFF3F4"}
        overflow={"hidden"}
      >
        <Icon as={BsSearch} size={5} color={"grey"} />
        <Input
          type="search"
          borderWidth={"0"}
          outline="none"
          className="custom-textarea"
          placeholder="Search Twitter"
          fontSize={"0.8rem"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box
        borderWidth={searchQuery === "" ? "0" : "1px"}
        borderTopWidth={"0"}
        padding="10px"
        bg={searchQuery === "" ? "white" : "#F7F9F9"}
        borderRadius={"10px"}
        mt={searchQuery === "" ? "0" : "5px"}
      >
        {searchQuery !== "" &&
          searchRes.map((result) => (
            <Box
              key={result.username}
              marginTop={"5px"}
              padding={"5px"}
              className="s-Item"
              display={"flex"}
              bg={isHovered(result.username) ? "#D9D7D8" : "transparent"}
              onMouseEnter={() => handleHover(result.username)}
              onMouseLeave={handleMouseLeave}
              borderRadius={"20px"}
            >
              <Avatar w={10} h={10} name={result.username} />
              <Box>
                <p className="name">{result.name}</p>
                <p className="username">@{result.username}</p>
              </Box>
            </Box>
          ))}
      </Box>
      <Box
        bg={"#F7F9F9"}
        padding="10px"
        mt={"10px"}
        borderRadius={"10px"}
        borderWidth={"1px"}
        display={"flex"}
        flexDir={"column"}
        gap={"5px"}
      >
        Whats Happening
        <Box
          className="s-Item"
          bg={isHovered("TwitterClone") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("TwitterClone")}
          onMouseLeave={handleMouseLeave}
          padding={"5px"}
          borderRadius={"20px"}
        >
          #TwitterClone
        </Box>
        <Box
          className="s-Item"
          bg={isHovered("React") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("React")}
          onMouseLeave={handleMouseLeave}
          padding={"5px"}
          borderRadius={"20px"}
        >
          #React
        </Box>
        <Box
          className="s-Item"
          bg={isHovered("Node") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Node")}
          onMouseLeave={handleMouseLeave}
          padding={"5px"}
          borderRadius={"20px"}
        >
          #Node
        </Box>
        <Box
          className="s-Item"
          bg={isHovered("Express") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Express")}
          onMouseLeave={handleMouseLeave}
          padding={"5px"}
          borderRadius={"20px"}
        >
          #Express
        </Box>
        <Box
          className="s-Item"
          bg={isHovered("Sqlite3") ? "#D9D7D8" : "transparent"}
          onMouseEnter={() => handleHover("Sqlite3")}
          onMouseLeave={handleMouseLeave}
          padding={"5px"}
          borderRadius={"20px"}
        >
          #Sqlite3
        </Box>
      </Box>
      <Box
        bg={"#F7F9F9"}
        padding="10px"
        mt={"10px"}
        borderRadius={"10px"}
        borderWidth={"1px"}
        display={"flex"}
        flexDir={"column"}
        gap={"5px"}
      >
        Who to Follow
        {searchRes.map((result) => (
          <Box
            key={result.username}
            marginTop={"5px"}
            padding={"5px"}
            className="s-Item"
            display={"flex"}
            bg={isHovered(result.username) ? "#D9D7D8" : "transparent"}
            onMouseEnter={() => handleHover(result.username)}
            onMouseLeave={handleMouseLeave}
            borderRadius={"20px"}
          >
            <Avatar w={10} h={10} name={result.username} />
            <Box>
              <p className="name">{result.name}</p>
              <p className="username">@{result.username}</p>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default RightSideBar;
