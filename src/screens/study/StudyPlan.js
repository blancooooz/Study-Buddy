{/* Display DueDate, Somehow integrate tasks based on subject, maybe 
  display statistics like total time spent, start time, current day, days remaining
  then further on implement AI */}
import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker'
//import * as pdfjsLib from 'pdfjs-dist'
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleStudyPlanCompletion } from "../../redux/actions";
import {Extractor } from 'react-native-pdf-extractor'
const StudyPlan = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id } = route.params;
  const theme = useTheme();
  const [file, setFile] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const studyPlan = useSelector((state) =>
    state.studyPlans.find((plan) => plan.id === id)
  );

  if (!studyPlan) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.text }}>Study Plan not found</Text>
      </View>
    );
  }
  useEffect(() => {
    if (file) {
      extractTextFromPdf(file.uri);
    }
  }, [file]);
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        
        //copyToCacheDirectory: true,
      });
      if(result){
        console.log('result valid?', result)
      if (result) {
        setFile(result);
        
        extractTextFromPdf(result.assets[0].uri);
      } else {
        Alert.alert('No file selected');
      }
    }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'There was an issue picking the document');
    }
  };

  // Extract text from the selected PDF file
  const extractTextFromPdf = async (uri) => {
    if (typeof uri !== 'string' || uri.trim() === '') {
      
      return;
    }
    console.log('uri from pickDoc', uri);
    try {
      //const pdfExtractor = new Extractor(uri);
      //const extractedText = await pdfExtractor.extractText();
      ////console.log('extracted text', extractedText);
      //setExtractedText(extractedText);
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      Alert.alert('Error', 'Could not extract text from the PDF');
    }
  };
  const renderSession = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Session", { studyPlanId: id, sessionId: item.id })
      }
      style={[styles.sessionContainer, { backgroundColor: theme.colors.card }]}
    >
      <Text style={[styles.sessionTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
  const callback = (data) => {
    console.log(data);
  }
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {studyPlan.title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        {studyPlan.description}
      </Text>
      <Extractor
      onResult={callback}
        uri={file && file?.assets[0]?.uri}
      >
        
      </Extractor>
      {file && (
        <View>
          <Text>Name: {file.name}</Text>
          <Text>URI: {file.assets[0].uri}</Text>
          <Text>Type: {file.assets[0].mimeType}</Text>
          <Text>Size: {file.size}</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={{ color: theme.colors.text }}>
          Subject:{" "}
          <Text style={{ color: studyPlan.subject.color }}>
            {studyPlan.subject.name}
          </Text>
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Urgent: {studyPlan.urgent ? "Yes" : "No"}
        </Text>
        <Text style={{ color: theme.colors.text }}>
          Completed: {studyPlan.completed ? "Yes" : "No"}
        </Text>
        {studyPlan.collaborative && (
          <Text style={{ color: theme.colors.text }}>
            Collaborative with: {studyPlan.users.join(", ")}
          </Text>
        )}
      </View>

      {studyPlan.reminder.enabled && (
        <Text style={[styles.reminderText, { color: theme.colors.text }]}>
          Reminder Set for: {studyPlan.reminder.reminder_time}
        </Text>
      )}

      <View style={styles.tagContainer}>
        {studyPlan.tags.map((tag, index) => (
          <Text
            key={index}
            style={[
              styles.tag,
              {
                color: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            {tag}
          </Text>
        ))}
      </View>

      <Text style={[styles.sessionHeader, { color: theme.colors.text }]}>
        Sessions
      </Text>
      <FlatList
        data={studyPlan.sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sessionList}
      />
      {studyPlan.completed ? (
        <>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary, marginBottom: 24 },
            ]}
            onPress={() => {
              dispatch(toggleStudyPlanCompletion(id));
            }}
          >
            <Text style={[{ color: theme.colors.card }, styles.buttonText]}>
              Reopen this Plan
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
        <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary, marginBottom: 24 },
            ]}
            onPress={() => {
              pickDocument();
            }}
          >
            <Text style={[{ color: theme.colors.card }, styles.buttonText]}>
              Upload Document
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary, marginBottom: 24 },
            ]}
            onPress={() => {
              dispatch(toggleStudyPlanCompletion(id));
              navigation.goBack();
            }}
          >
            <Text style={[{ color: theme.colors.card }, styles.buttonText]}>
              Complete this Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate("Add a Session", { planId: id })}
          >
            <Text style={[{ color: theme.colors.primary }, styles.buttonText]}>
              Add Session
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12,
  },
  reminderText: {
    fontStyle: "italic",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tag: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 24,
  },
  sessionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },
  sessionList: {
    paddingBottom: 16,
  },
  sessionContainer: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default StudyPlan;
