import { Button, View,Text } from "react-native";

const Daily = ({ userData }) => {
  return (
    <View>
      <Text>Welcome {userData?.name}</Text>
      {/* Use userData here */}
    </View>
  );
};

export default Daily;
