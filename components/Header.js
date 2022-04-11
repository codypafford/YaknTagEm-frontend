import React, { useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

  
const Header = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "grey" }}>
      <Text style={{ color: "#FFAA33", fontSize: 40, marginTop: 50, marginLeft: 50, marginRight: 50, textDecorationLine: "underline"}}>Yak & Tag 'Em</Text>
      <Text style={{ color: "#FFAA33", fontSize: 15, textDecorationLine: "underline", marginTop: 10}}>User Driven Kayaking App</Text>
    </View>
  );
};

export default Header;
