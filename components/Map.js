import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  Dimensions,
  Image,
  Pressable,
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MyModal from "./MyModal";
import * as Location from "expo-location";
import ExistingLocationModal from "./ExistingLocationModal";
import LocationService from "../services/LocationService";
import logo from "../assets/river.png";
import LocationDetailsModal from "./LocationDetailsModal";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      marker: null,
      selectLocationMode: false,
      showModal: false,
      showExistingLocModal: false,
      existingLocs: [],
      myLoc: {},
      chosenLocation: {},
      isLoaded: false,
      flagReloader: false
    };
  }
  rerender = () => {
    console.log("re-rendering??")
    this.setState({flagReloader: !this.state.flagReloader});
    LocationService.getAllLocations()
      .then((r) => {
        this.setState({ existingLocs: r.data });
        this.setState({ selectLocationMode: false });
        this.setState({ marker: null });
        this.setState({chosenLocation: {}})
        console.log("All locations should be reloaded now")
      })
      .catch((error) => {
        console.log("failed: " + error);
      });
  };

  componentDidMount() {
    this.setCurrentLocation();
    LocationService.getAllLocations()
      .then((r) => {
        this.setState({ existingLocs: r.data });
      })
      .catch((error) => {
        console.log("failed: " + error);
      });
    console.log("reloaded");
  }

  setCurrentLocation() {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ myLoc: location });
      this.setState({
        region: {
          ...this.state.region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
      this.setState({ isLoaded: true });
      console.log("The current location object: ");
      console.log(location);
      console.log("The current location latitude");
      console.log(location.coords.latitude);
      console.log("The current region info 0: ");
      console.log(this.state.region);
    })();
  }

  render() {
    const selectLocationMode = this.state.selectLocationMode;
    const isLoaded = this.state.isLoaded;
    return (
      <View style={styles.container}>
        {!isLoaded && (
          <Image
            source={logo}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          />
        )}
        {isLoaded && (
          <View>
            <Text style={{ alignContent: "center", textAlign: "center" }}>
              {selectLocationMode ? "Select a point on the map" : " "}
            </Text>
            <Pressable
              onPress={() => {
                if (!selectLocationMode) {
                  this.setState({ selectLocationMode: true });
                  console.log("The current region info 1: ");
                  console.log(this.state.region);
                } else {
                  this.setState({ selectLocationMode: false });
                  this.setState({ marker: null });
                  console.log("The current region info 2: ");
                  console.log(this.state.region);
                }
              }}
              style={styles.button}
            >
              <Text>
                {selectLocationMode ? "Cancel" : "+ Add a Kayaking location"}
              </Text>
            </Pressable>
            <MapView
              style={styles.map}
              region={this.state.region}
              latitudeDelta={this.state.region.latitudeDelta}
              longitudeDelta={this.state.region.longitudeDelta}
              onPress={(e) => {
                if (selectLocationMode) {
                  console.log(
                    "The coords of chosen point are: " +
                      e.nativeEvent.coordinate.latitude +
                      ", " +
                      e.nativeEvent.coordinate.longitude
                  );
                  this.setState({
                    region: {
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                      latitudeDelta: 0.009,
                      longitudeDelta: 0.009,
                    },
                  });
                  this.setState({ marker: e.nativeEvent.coordinate });
                  this.setState({ chosenLocation: {} });
                }
              }}
            >
              {
                // if state contains marker variable with a valid value, render the marker
                this.state.marker && (
                  <MapView.Marker
                    coordinate={this.state.marker}
                    pinColor="green"
                  />
                )
              }

              {
                // add markers for existing locations
                this.state.existingLocs.map((item, index) => {
                  var lat = item.latitude;
                  var long = item.longitude;
                  var name = item.name;
                  var id = item.id;
                  return (
                    <MapView.Marker
                      coordinate={{
                        latitude: parseFloat(lat),
                        longitude: parseFloat(long),
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta,
                      }}
                      key={id}
                      title={name}
                      onPress={(e) => {
                        this.setState({ chosenLocation: item });
                        console.log("The chosen location: ");
                        console.log(item);
                        this.setState({
                          region: {
                            ...this.state.region,
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude,
                          },
                        });
                      }}
                      pinColor="#FFAA33"
                    />
                  );
                })
              }
            </MapView>
            {
              // if state contains marker variable with a valid value, render the marker
              this.state.marker && (
                <MyModal
                  isVisible={this.state.showModal}
                  title="Add Details"
                  latitude={this.state.region.latitude}
                  longitude={this.state.region.longitude}
                  key={new Date()}
                  rerender={this.rerender}
                ></MyModal>
              )
            }
            {
              // if state contains a chosen location variable with a valid value, render the marker
              Object.entries(this.state.chosenLocation).length !== 0 && (
                <ExistingLocationModal
                  title={this.state.chosenLocation.name}
                  isVisible={this.state.showExistingLocModal}
                  location={this.state.chosenLocation}
                  rerender={this.rerender}
                ></ExistingLocationModal>
              )
            }

{/* {
              // if state contains a chosen location variable with a valid value, render the marker
              Object.entries(this.state.chosenLocation).length !== 0 && (
                <LocationDetailsModal
                  isVisible={this.state.showExistingLocModal}
                  location={this.state.chosenLocation}
                  rerender={this.rerender}
                  date={new Date()}
                ></LocationDetailsModal>
              )
            } */}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: Dimensions.get("window").height * 0.65,
    borderRadius: 30,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
  },
});
