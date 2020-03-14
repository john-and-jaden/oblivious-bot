import React, { Component, createRef } from 'react';
import { StyleSheet, Button, Image, View } from 'react-native';
import Tts from 'react-native-tts';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: null,
      hasCameraPermission: false,
      cameraType: Camera.Constants.Type.back
    };
    this.camera = createRef();
    this.takePic = this.takePic.bind(this);
    this.readText = this.readText.bind(this);
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(result => {
      this.setState({
        hasCameraPermission: result.status === 'granted'
      });
    });
  }

  async takePic() {
    let photo = await this.camera.current.takePictureAsync({ base64: true })
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: photo.base64 })
    };
    fetch('http://192.168.0.116:3000', options)
      .then(response => response.json())
      .then(data => {
        console.log("successful response");
      })
      .catch(err => {
        console.log("that's not good.");
      });
  }

  readText(text) {
    console.log(Tts.getInitStatus());
    //Tts.speak('hello world');
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={this.state.cameraType}
          ref={this.camera}
        />
        <Button
          style={styles.button}
          title='Take Picture'
          onPress={this.takePic}
        />
        <Image style={styles.image} source={{ uri: `${this.state.imgData}` }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    position: 'absolute',
    backgroundColor: 'red'
  },
  camera: {
    flex: 1,
    width: '100%'
  },
  image: {
    flex: 1,
    width: '100%'
  }
});
