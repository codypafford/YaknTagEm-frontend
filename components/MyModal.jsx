import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";
import ImagePickerExample from "./ImagePickerExample";
import Form from "react-native-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LocationService from "../services/LocationService";
import { sectionData } from "../data/data.json";

function MyModal(props) {
  const [isModalVisible, setModalVisible] = useState(props.isVisible);
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficultyValue] = useState(0);
  const [reload, setReload] = useState(false);
  const [tagButtons, setTagButtons] = useState(sectionData.tagTypes);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onSubmit = function () {
    alert("Creating: " + name);
    var latitude = props.latitude;
    var longitude = props.longitude;
    let tags_array = tags.split(",");
    let tags_btn_array = [];
    for (var key of Object.keys(tagButtons)) {
      if (tagButtons[key]) {
        tags_btn_array.push(key);
      }
    }
    var final_tag_array = tags_array.concat(tags_btn_array);

    let loc = {
      name,
      tags: final_tag_array,
      difficulty,
      comments,
      latitude,
      longitude,
    };
    LocationService.createLocation(loc)
      .then((r) => {
        console.log("THEN");
        console.log("RE_RENDERED");
        props.rerender();
      })
      .catch((error) => {
        console.log("failed: " + error);
      });
    // setReload(!reload);
    // console.log("reloaded the page");
    // setModalVisible(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      <KeyboardAwareScrollView>
        <Button title={props.title} onPress={toggleModal} color="#FFAA33" />
        <Modal
          isVisible={isModalVisible}
          backdropColor="white"
          style={{ marginTop: 55 }}
        >
          <KeyboardAwareScrollView
            style={{
              backgroundColor: "white",
              borderBottomColor: "#000000",
              borderBottomWidth: 2,
              padding: 15,
            }}
          >
            <Button title="Cancel" onPress={toggleModal} color="red" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                textDecorationLine: "underline",
              }}
            >
              Name of Kayak Launch:
            </Text>
            <TextInput
              placeholder="Name of park/launch"
              multiline
              style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(t) => setName(t)}
              value={name}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                textDecorationLine: "underline",
              }}
            >
              Select Tags:
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              {Object.keys(tagButtons).map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={{ margin: 10 }}
                      onPress={(e) =>
                        setTagButtons({
                          ...tagButtons,
                          [item]: !tagButtons[item],
                        })
                      }
                    >
                      <Text
                        key={"000" + index + "000"}
                        style={{
                          textAlign: "center",
                          fontSize: 15,
                          color: tagButtons[item] ? "green" : "grey",
                        }}
                      >
                        {item.replace("_", " ")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {/* <TextInput
              placeholder="Comments"
              multiline
              style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(t) => setComments(t)}
              value={comments}
            /> */}
            <TextInput
              placeholder="Tags (separate each tag by a comma)"
              multiline
              style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(t) => setTags(t)}
              value={tags}
            />
            <Text>Rate the difficulty of this location</Text>
            <Slider
              step={1}
              minimumValue={0}
              maximumValue={10}
              value={difficulty}
              onValueChange={(slideValue) => setDifficultyValue(slideValue)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
            <Text>Difficulty value: {difficulty}</Text>
            <ImagePickerExample></ImagePickerExample>
            <Button
              raised
              icon={{ name: "check" }}
              title="Submit"
              name="submit"
              color="green"
              onPress={onSubmit}
            />
          </KeyboardAwareScrollView>
        </Modal>
      </KeyboardAwareScrollView>
    </Form>
  );
}

export default MyModal;
