import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { Fontisto } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './color';

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  useEffect(() => {
    loadToDos()
  }, [])
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  const addToDo = async () => {
    if (text === "") return
    const newToDo = { ...toDos, [Date.now()]: { text, working } }
    setToDos(newToDo)
    await saveToDos(newToDo)
    setText("")
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    s && setToDos(JSON.parse(s))
  }
  const deleteToDo = async (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?")
      if (ok) {
        const newTodos = { ...toDos }
        delete newTodos[key]
        setToDos(newTodos)
        saveToDos(newTodos)
      }
    } else {
      Alert.alert("Delete To Do", "Ary you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          style: "destructive",
          onPress: () => {
            const newTodos = { ...toDos }
            delete newTodos[key]
            newTodos[key] = { completed: true }
            setToDos(newTodos)
            saveToDos(newTodos)
          }
        }
      ])
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{
            fontSize: 38, fontWeight: "600", color: working ? "white" : theme.grey
          }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ fontSize: 38, fontWeight: "600", color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        returnKeyType='done'
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map(key => (
          toDos[key].working === working ? <View key={key} style={styles.toDo}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Fontisto name="trash" size={18} color={theme.grey} />
            </TouchableOpacity>
          </View> : null
        ))}
      </ScrollView>
      <StatusBar style="light" />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
  },
  btnText: {
    // fontSize: 38,
    // fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
