import react, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from'expo-sqlite';

export default function App() {
  //open database or create it if it does not exist
  const db = SQLite.openDatabase('shoppinglist.db');

  const [product, onChangeProduct] = useState("");
  const [amount, onChangeAmount] = useState("");
  const [data, setData] = useState([]);

  const updateList = () => {  
    db.transaction(tx => {    
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => setData(rows._array)    );   
    });
  }

  const saveItem = () => {  
    db.transaction(tx => {    
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',  [product, amount]);    
    }, null, updateList)}

    const deleteItem = (id) => {
      db.transaction(
        tx => {
          tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
        }, null, updateList
      )    
    }
  

  //creating a table
  useEffect(() => {
    db.transaction(tx => {  
      tx.executeSql('create table if not exists shoppinglist (id integer primary key  not null, product text, amount text);');  
    }, null, updateList);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeProduct}
        value={product}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeAmount}
        value={amount}
      />
      <Button onPress={saveItem} title="SAVE" color="#f194ff" style={styles.button}  ></Button>

      <View style={styles.containerTwo}>
        <Text style={{color: "blue", fontWeight: "bold", marginTop: 10}}>Shopping List</Text>
        <FlatList   
          style={{marginLeft : "5%"}}  
          keyExtractor={item => item.id.toString()}   
          renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text>{item.product},{item.amount}</Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}        
          data={data} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },

  containerTwo: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    width: 100, 
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
