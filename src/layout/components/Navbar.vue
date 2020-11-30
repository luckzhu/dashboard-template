<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="!isMobile">
        <div class="avatar-wrapper">
          <el-avatar size="medium" :src="avatarUrl" />
        </div>
        <div v-if="!isMobile" class="welcome">欢迎，{{ name }}</div>
      </template>
      <el-tooltip v-for="item in actionIcons" :key="item.class" class="action-icon" effect="dark" :content="item.content" placement="bottom">
        <div @click="item.clickEvent">
          <svg-icon :icon-class="item.iconClass" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      actionIcons: [
        { iconClass: 'key', content: '修改密码', clickEvent: this.logout },
        { iconClass: 'logout', content: '退出登录', clickEvent: this.logout }
      ],
      avatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'isMobile'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    justify-content: flex-end;
    height: 100%;
    line-height: 50px;
    margin-right: 20px;

    .avatar-wrapper {
      margin-top: 7px;
      position: relative;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .welcome{
      margin: 0 10px;
    }

    .action-icon {
      cursor: pointer;
      color: $menuActiveText;
      &:not(:last-child) {
        margin-right: 6px;
      }
      .svg-icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
