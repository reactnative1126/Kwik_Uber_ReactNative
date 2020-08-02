import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";

function MaterialButtonYellow(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={() => { props.onPress() }}>
      <Text style={styles.caption}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FDF75C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    paddingLeft: 16,
    elevation: 2,
    minWidth: 88,
    borderRadius: 10,
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 5
  },
  caption: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto-Regular"
  }
});

export default MaterialButtonYellow;
