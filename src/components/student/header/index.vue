<template>
  <div id="studentHeader">
    {{ title }}
  </div>
</template>

<script>
export default {
  name: "StudentHeader",
  props: {
    title: String
  }
}
</script>

<style scoped>
#studentHeader {
  padding: 15px 0 15px 0;

  width: 100%;

  font-size: 25px;
  font-weight: bold;

  text-align: center;

  color: #ffffff;

  background-color: #1D59AE;
}
</style>