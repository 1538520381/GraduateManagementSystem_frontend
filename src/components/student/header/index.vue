<template>
  <div id="studentHeader">
    <div class="toHomeButton" v-if="toHomeButtonFlag" @click="toHome"><返回</div>
    <div class="block" v-else></div>
    <div class="title">{{ title }}</div>
    <div class="block"></div>
  </div>
</template>

<script>
export default {
  name: "StudentHeader",
  props: {
    title: String,
    toHomeButtonFlag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toHome() {
      if (window.location.pathname !== '/student/homt') {
        this.$router.push('/student/home')
      }
    }
  }
}
</script>

<style scoped>
#studentHeader {
  display: flex;

  padding: 15px 0 15px 0;

  width: 100%;

  font-size: 25px;
  font-weight: bold;

  line-height: 25px;

  text-align: center;

  color: #ffffff;

  background-color: #1D59AE;

  justify-content: space-between;
}

#studentHeader .toHomeButton {
  display: inline-block;

  width: 60px;

  font-size: 15px;

  line-height: 25px;
}

#studentHeader .block {
  display: inline-block;

  width: 60px;
}

#studentHeader .title {
  display: inline-block;
}
</style>