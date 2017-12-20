import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Repo from './Components/Repo';
import NewRepoModal from './Components/NewRepoModal';

export default class App extends React.Component {
  //state é um objeto .
  //repos é um array .
  state = {
    modalVisible: false,
    repos :[],
  };

  async componentDidMount(){
    const repos = JSON.parse(await AsyncStorage.getItem('@Minicurso:repos')) || [];
    this.setState({repos});
  }

  addRepository = async (newRepoText) => {
    const repoCall = await fetch(`http://api.github.com/repos/${newRepoText}`);
    const response = await repoCall.json();

    const repository = {

      id: response.id,
      thumbnail: response.owner.avatar_url,
      title: response.name,
      author: response.owner.login,
      
    };  

    this.setState({
      modalVisible: false,
      repos: [
        ...this.state.repos,
        repository,
      ],
    });

    await AsyncStorage.setItem('@Minicurso:repos', JSON.stringify(this.state.repos));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Minicurso GoNative</Text>
          <TouchableOpacity onPress={ () => this.setState({modalVisible: true})}>
            <Text style={styles.headerButton}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.repolist}>

          {this.state.repos.map(repo =>  <Repo key={repo.id} data = {repo}/> )}

        </ScrollView>

        <NewRepoModal onCancel={() => this.setState({modalVisible: false,})} onAdd={this.addRepository} visible={this.state.modalVisible}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  header:{
    //height: 50,
    //paddingTop: 20,
    height: (Platform.OS === 'ios') ? 70 : 50,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    //justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerButton:{
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerText:{
    fontSize: 16,
    fontWeight: 'bold',
  },

  repolist:{
    padding: 20,
  },


});
