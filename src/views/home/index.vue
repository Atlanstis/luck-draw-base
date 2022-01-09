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
    <el-dialog
      title=" "
      :width="'400px'"
      :show-close="false"
      :visible.sync="dialShow"
    >
      <div class="dialog-body">
        <div class="dialog-title">恭喜你抽中</div>
        <div class="dialog-content">
          {{ prizeMap[prizeId] }}
        </div>
        <div class="dialog-btn" @click="dialogClose">收下奖励</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { prizeMap } from '@/constants.js'

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
      times: 0,
      results: [],
      nowIndex: -1,
      dialShow: false,
      prizeMap,
      prizeId: 0,
    }
  },

  mounted() {
    let audio = document.querySelector('#audio')
    audio.onended = function () {
      //播放完毕，重新循环播放
      audio.load()
      audio.play()
    }
    const times = localStorage.getItem('__times__')
    if (times) {
      this.times = Number(times)
    }
    const results = localStorage.getItem('__results__')
    if (results) {
      this.results = JSON.parse(results)
    }
    const nowIndex = localStorage.getItem('__nowIndex__')
    if (nowIndex) {
      this.nowIndex = Number(nowIndex)
    }
  },

  methods: {
    audioAutoPlay() {
      let audio = document.querySelector('#audio')
      audio.play()
      this.auditShow = false
    },

    dialogClose() {
      this.dialShow = false
    },

    // 点击抽奖按钮会触发star回调
    startCallback() {
      if (this.times === 0) {
        this.$message.error({
          message: '请先设置抽奖次数',
          duration: 1000,
        })
        return
      }
      if (this.results.length === 0) {
        this.$message.error({
          message: '请先初始化抽奖结果',
          duration: 1000,
        })
        return
      }
      if (this.nowIndex === this.times - 1) {
        this.$message.error({
          message: '抽奖次数已达上限，请初始化抽奖结果',
          duration: 1000,
        })
        return
      }
      if (this.isTurning) return
      this.isTurning = true
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      if (!this.$turnAudio) {
        this.$turnAudio = document.querySelector('#turnAudio')
      }
      this.$turnAudio.play()
      setTimeout(() => {
        this.nowIndex++
        localStorage.setItem('__nowIndex__', this.nowIndex)
        this.prizeId = this.results[this.nowIndex]
        this.$refs.myLucky.stop(this.prizeId)
        this.isTurning = false
        setTimeout(() => {
          this.$turnAudio.pause()
          this.$turnAudio.load()
        }, 2.5 * 1000)
      }, 4 * 1000)
    },

    endCallback() {
      this.dialShow = true
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
.dialog-title {
  font-size: 20px;
  color: #d25f00;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
}

.dialog-content {
  font-size: 28px;
  color: #d25f00;
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  margin-top: 30px;
}

.dialog-btn {
  margin: 40px auto 20px;
  width: 200px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background-color: #e35551;
  border-radius: 50px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
</style>
