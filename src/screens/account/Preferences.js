import { ThemeProvider } from "@react-navigation/native";
import { Switch, View, Text } from "react-native";
import { colors } from "../../theme/colors";

const Preferences = () => {
  return (
    <View style={{ flexDirection: "row", marginTop:12, backgroundColor:colors.blueViolet }}>
      <Text style={{ fontSize: 32 }}>Light</Text>
      <Switch></Switch>
      <Text style={({fontSize:32})}>Dark</Text>
    </View>
  );
};

export default Preferences;
