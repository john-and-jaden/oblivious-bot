import React, { Component, createRef } from 'react';
import { StyleSheet, Button, Image, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as Speech from 'expo-speech';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: null,
      hasCameraPermission: false,
      isActive: false,
      cameraType: Camera.Constants.Type.front
    };
    this.camera = createRef();
    this.takePic = this.takePic.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(result => {
      this.setState({
        hasCameraPermission: result.status === 'granted'
      });
    });
    
    this.interval = setInterval(() => this.takePic(), 2000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async takePic() {
    if (!this.state.isActive) {
      return;
    }

    let photo = await this.camera.current.takePictureAsync({ base64: true });
    this.setState({
      imgData: photo.uri
    });

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: photo.base64 })
    };
    fetch('http://192.168.0.116:3001', options)
      .then(response => response.text())
      .then(text => {
        Speech.speak(text);
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleActive() {
    this.setState(state => {
      let notActive = !state.isActive;
      return {
        isActive: notActive
      };
    });
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
          title={this.state.isActive ? 'Disable' : 'Enable'}
          onPress={this.toggleActive}
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
