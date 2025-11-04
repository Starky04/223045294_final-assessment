import React, { useState, useEffect } from "react";
import { View, Text, Image, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const slides = [
  { img: require("../assets/images/slide1.png"), text: "Browse Hotels" },
  { img: require("../assets/images/slide2.png"), text: "Book Your Stay" },
  { img: require("../assets/images/slide3.png"), text: "Leave Reviews" },
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem("onboarded").then((res) => {
      if (res) navigation.replace("SignIn");
    });
  }, []);

  const next = async () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else {
      await AsyncStorage.setItem("onboarded", "true");
      navigation.replace("SignUp");
    }
  };

  return (
    <View>
      <Image source={slides[current].img} style={{ width: 250, height: 200 }} />
      <Text>{slides[current].text}</Text>
      <Button title={current < slides.length - 1 ? "Next" : "Get Started"} onPress={next} />
    </View>
  );
}
