import { Button, View } from "react-native";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../utils/DataHandler";

const Account = () => {
  return (
    <View>
      <Button title="Sign Out" onPress={()=>signOut(firebaseAuth)} />
    </View>
  );
};
export default Account;
