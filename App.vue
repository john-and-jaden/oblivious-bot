<template>
  <view class="container">
    <text class="text-color-primary">{{message}}</text>
  </view>
</template>

<script>
export default {
  data: function() {
    return {
      message: "Hello World"
    };
  }
};
</script>

<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
