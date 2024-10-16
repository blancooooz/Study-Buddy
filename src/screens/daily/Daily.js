import { Button, View } from "react-native";

const Daily = ({navigation}) => {
  return <View>

    <Button
    title="Prefs"
    onPress={()=>{navigation.navigate("Preferences")}}>

    </Button>
  </View>;
};

export default Daily;
