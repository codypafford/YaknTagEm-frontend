import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  Pressable,
  TouchableOpacity,
  useEffect,
} from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";
import ImagePickerExample from "./ImagePickerExample";
import Form from "react-native-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sectionData } from "../data/data.json";
import LocationService from "../services/LocationService";

function LocationDetailsModal(props) {
  const [isModalVisible, setModalVisible] = useState(props.isVisible);
  const [tagMode, setTagMode] = useState(false);
  const [tagButtons, setTagButtons] = useState(sectionData.tagTypes);
  const [locationId, setLocationId] = useState(props.location.id);
  const [location, setLocation] = useState(props.location);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleTagMode = () => {
    setTagMode(!tagMode);
  };

  React.useEffect(() => {
    console.log("The use effect was triggered: ");
    console.log("Value of name is " + location.name);
    LocationService.getLocationById(props.location.id).then((r) => {
      if (locationId != r.data.id) {
        console.log("This is where we would set the location ID AGAIN");
      } else {
        console.log("Sent the ID location...");
      }
      setLocationId(r.data.id);
      console.log("Set the ID to: " + r.data.id);
    });
  }, [locationId, location]);

  const onSubmit = function () {
    alert("it works!: " + name);
    console.log(tagButtons);
    let tags_btn_array = [];
    for (var key of Object.keys(tagButtons)) {
      if (tagButtons[key]) {
        tags_btn_array.push(key);
      }
    }
    console.log(tags_btn_array);

    LocationService.updateTagsByLocationID(locationID, tags_btn_array)
      .then((r) => {
        console.log("THEN");
        console.log("RE_RENDERED");
        toggleTagMode();
        // LocationService.getLocationById(locationID).then((r) => {
        //   console.log("retrieved locatiom by id: ");
        //   console.log(r.data);
        // });
        props.rerender();
      })
      .catch((error) => {
        console.log("failed: " + error);
      });
  };

  return <Text>{props.location.id}</Text>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default LocationDetailsModal;
