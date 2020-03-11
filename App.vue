<template>
  <view class="container">
    <Camera class="container" :type="this.type" />
  </view>
</template>

<script>
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

export default {
  components: { Camera },
  data: function() {
    return {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back
    };
  },
  mounted: function() {
    Permissions.askAsync(Permissions.CAMERA)
      .then(status => {
        hasCameraPermission = status.status == "granted" ? true : false;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
.container {
  /* background-color: white;
  align-items: center;
  justify-content: center; */
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
