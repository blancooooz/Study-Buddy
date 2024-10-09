import { Button, View } from "react-native";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../utils/DataHandler";

const StudyPlan = () => {
  return (
    <View>
      <Button title="Sign Out" onPress={()=>signOut(firebaseAuth)} />
    </View>
  );
};
export default StudyPlan;
