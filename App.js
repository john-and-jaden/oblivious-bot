import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: false,
      cameraType: Camera.Constants.Type.back
    };
    this.takePic = this.takePic.bind(this);
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA)
      .then(status => {
        this.state.hasCameraPermission = status.status == "granted" ? true : false;
      })
      .catch(err => {
        console.log(err);
      });
  }

  takePic() {
    const cameraInstance = new Camera();
    cameraInstance
      .takePictureAsync()
      .then(pic => {
        console.log(pic);
      })
      .catch(err => {
        console.log("THERE HAS BEEN AN ERROR");
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={this.state.cameraType} ref="cameraObject" />
        <button style={styles.button} title="takePic" onClick={this.takePic}>take pic</button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textColorPrimary: {
    color: 'blue'
  },
  button: {
    position: 'absolute',
    backgroundColor: 'red'
  },
  camera: {
    height: '50%',
    margin: '100px'
  }
});
