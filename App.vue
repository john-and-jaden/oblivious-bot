<template>
  <view class="container">
    <Camera class="camera" :type="this.type" ref="cameraObject" />
    <button title="takePic" class="button" :on-press="takePic">take pic</button>
  </view>
</template>

<script>
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

export default {
  components: { Camera },
  data() {
    return {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
      myCamera: null
    };
  },
  mounted() {
    Permissions.askAsync(Permissions.CAMERA)
      .then(status => {
        hasCameraPermission = status.status == "granted" ? true : false;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
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
  }
};
</script>

<style>
.container {
  flex: 1;
}
.text-color-primary {
  color: blue;
}
.button {
  position: absolute;
  background-color: red;
}
.camera {
  height: 50%;
  margin: 100px;
}
</style>
