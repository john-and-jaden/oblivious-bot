import React, { Component, createRef } from 'react';
import { StyleSheet, Button, Image, View } from 'react-native';
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
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA)
    .then(result => {
      this.setState({
        hasCameraPermission: result.status === 'granted'
      });
    });
  }

  takePic() {
    //alert('Yeet');
    this.camera.current.takePictureAsync({ base64: true })
    .then(pic => {
      console.log(pic.uri);
      this.setState({
        imgData: pic.uri
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={this.state.cameraType} ref={this.camera} />
        <Button style={styles.button} title="Take Picture" onPress={this.takePic} />
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
