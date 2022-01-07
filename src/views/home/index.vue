<template>
  <div class="lucky-wrap">
    <LuckyWheel
      ref="myLucky"
      class="lucky"
      width="500px"
      height="500px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    />
    <audio
      preload="auto"
      loop
      id="audio"
      :src="require('../../assets/music/bg.mp3')"
    ></audio>
    <audio
      preload="auto"
      id="turnAudio"
      :src="require('../../assets/music/turn.mp3')"
    ></audio>
    <el-button
      v-if="auditShow"
      icon="el-icon-video-play"
      circle
      @click="audioAutoPlay"
    ></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blocks: [
        {
          padding: '70px',
          imgs: [
            {
              src: require('../../assets/imgs/turn-table-bg.png'),
              width: '100%',
              height: '100%',
            },
          ],
        },
      ],
      prizes: [
        {
          background: '#ffb6b9',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#fae3d9',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#bbded6',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#8ac6d1',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#ffb6b9',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#fae3d9',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
        {
          background: '#bbded6',
          imgs: [
            {
              src: require('../../assets/imgs/gift.png'),
              width: '40%',
              top: '24%',
            },
          ],
        },
      ],
      buttons: [
        {
          radius: '50%',
          imgs: [
            {
              src: require('../../assets/imgs/turn-btn.png'),
              width: '60%',
              top: '-76%',
            },
          ],
        },
      ],
      auditShow: true,
      isTurning: false,
      $turnAudio: null,
    }
  },

  mounted() {
    let audio = document.querySelector('#audio')
    audio.onended = function () {
      //播放完毕，重新循环播放
      audio.load()
      audio.play()
    }
  },

  methods: {
    audioAutoPlay() {
      let audio = document.querySelector('#audio')
      audio.play()
      this.auditShow = false
    },

    // 点击抽奖按钮会触发star回调
    startCallback() {
      if (this.isTurning) return
      this.isTurning = true
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      if (!this.$turnAudio) {
        this.$turnAudio = document.querySelector('#turnAudio')
      }
      this.$turnAudio.play()
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = 0
        // 调用stop停止旋转并传递中奖索引
        this.$refs.myLucky.stop(index)
        this.isTurning = false
      }, 12 * 1000)
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize)
    },
  },
}
</script>

<style lang="scss" scoped>
.lucky-wrap {
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #e53935;
  background: -webkit-linear-gradient(to right, #e53935, #e35d5b);
  background: linear-gradient(to right, #e53935, #e35d5b);
  .lucky {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
