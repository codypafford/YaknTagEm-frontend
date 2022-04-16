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
} from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";
import ImagePickerExample from "./ImagePickerExample";
import Form from "react-native-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect } from "react/cjs/react.production.min";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sectionData } from "../data/data.json";
import LocationService from "../services/LocationService";

function ExistingLocationModal(props) {
  const [isModalVisible, setModalVisible] = useState(props.isVisible);
  const [tagMode, setTagMode] = useState(false);
  const [tagButtons, setTagButtons] = useState(sectionData.tagTypes);

  const name = props.location.name;
  const rating = props.location.rating;
  const tags = props.location.tags;
  const locationID = props.location.id;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleTagMode = () => {
    setTagMode(!tagMode);
  };

  const onSubmit = function () {
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

  return (
    <Form onSubmit={onSubmit}>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={toggleModal} style={styles.button}>
            <Text style={{ fontSize: 20 }}>
              {props.title}{" "}
              <MaterialCommunityIcons
                name="information"
                style={{ margin: 5, fontSize: 20 }}
              ></MaterialCommunityIcons>
            </Text>
          </Pressable>
        </View>
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
            <Button title="Exit" onPress={toggleModal} color="red" />
            <Text style={{ textAlign: "center", fontSize: 10 }}>
              ID: {locationID}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 10 }}>
              Lat, Long:{" "}
              {props.location.latitude + ", " + props.location.longitude}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
              Name: {name}
            </Text>
            <View>
              <Pressable style={styles.button} onPress={toggleTagMode}>
                <Text>{tagMode ? "Cancel" : "Add Tags"}</Text>
              </Pressable>
              {tagMode && (
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
                  <Pressable
                    style={{ ...styles.button, backgroundColor: "green" }}
                    onPress={onSubmit}
                  >
                    <Text>{`Save & Exit`}</Text>
                  </Pressable>
                </View>
              )}
              <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
                Top 10 Tags:
              </Text>
              {getTop10TagsObject(tags).map((key, index) => {
                return (
                  key[0] != "" &&
                  key[0] != null && (
                    <Text
                      key={key[0]}
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        borderColor: "black",
                        borderWidth: 5,
                        borderRadius: 10,
                        backgroundColor: "#FFFFE0",
                      }}
                    >
                      {key[0].replace("_", " ") + " (" + key[1] + ")"}
                    </Text>
                  )
                );
              })}
              <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
                Rating: {rating}
              </Text>
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuddi0ibXXyKmjE3fEetYhK5EJhLllcbK6KrRjsr0PuTgx6kQwH-XbYiSnDEs68aDCF2I&usqp=CAU",
                }}
                style={{ width: 500, height: 300 }}
              />
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      </KeyboardAwareScrollView>
    </Form>
  );
}

function getTop10TagsObject(tags) {
  var top_tags_obj = {};

  tags.forEach((tag) => {
    if (top_tags_obj[tag]) {
      let count = top_tags_obj[tag];
      top_tags_obj[tag] = count + 1;
    } else {
      top_tags_obj[tag] = 1;
    }
  });

  let sortable = [];
  for (var a_tag in top_tags_obj) {
    sortable.push([a_tag, top_tags_obj[a_tag]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  const slicedArray = sortable.slice(0, 11);

  return slicedArray;
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

export default ExistingLocationModal;
