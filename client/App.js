import React, { Component, createRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
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
    this.toggleCameraType = this.toggleCameraType.bind(this);
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

  toggleCameraType() {
    this.setState(state => {
      let newType =
        state.cameraType === Camera.Constants.Type.front
          ? Camera.Constants.Type.back
          : Camera.Constants.Type.front;
      return {
        cameraType: newType
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.toggleActive}>
            <Text style={styles.buttonText}>
              {this.state.isActive ? 'Disable' : 'Enable'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.toggleCameraType}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
        </View>
        <Image style={styles.image} source={{ uri: `${this.state.imgData}` }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D2D2A',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 0.2
  },
  button: {
    backgroundColor: '#06D6A0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    flex: 1
  },
  buttonText: {
    color: '#FDFFFC',
    fontSize: 32
  },
  camera: {
    flex: 1,
    margin: 3
  },
  image: {
    flex: 1,
    margin: 3
  }
});
