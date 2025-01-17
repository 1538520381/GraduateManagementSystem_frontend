<template>
  <div id="sidebarMenu">
    <el-menu class="menu" :default-active="active">
      <el-menu-item class="menuItem" index="0" v-if="userType === 'admin'">
        <i class="el-icon-menu"></i>
        <span slot="title">学生管理</span>
      </el-menu-item>
      <el-menu-item class="menuItem" index="0" v-if="userType === 'student'">
        <i class="el-icon-menu"></i>
        <span slot="title">组员管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  props: {
    userType: String,

    active: String,
  },
}
</script>

<style scoped>
#sidebarMenu {
  width: 200px;
  height: 100%;

  background: #F0F9FD;
}

#sidebarMenu .menu .menuItem:hover {
  background: #FFFFFF;
}

#sidebarMenu .menu .menuItem:focus {
  background: #FFFFFF;
}
</style>