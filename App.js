import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState([]);


  const addTask = () => {
    if (inputText.trim()) {
      const newTask = { id: Date.now().toString(), text: inputText };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setInputText('');
    } else {
      Alert.alert('Peringatan', 'Tulis dulu tugasnya!');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{item.text}</Text>
      <Button title="Hapus" onPress={() => deleteTask(item.id)} color="red" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tambah tugas..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Tambah" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 1,
  },
  taskText: {
    fontSize: 16,
  },
});

export default App;