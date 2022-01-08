<template>
  <div class="wrap">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-table :data="prizes">
          <el-table-column prop="name" label="奖品名称"></el-table-column>
          <el-table-column prop="num" label="个数"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="总计抽奖次数:" prop="times">
            <el-input-number
              v-model="form.times"
              size="medium"
              controls-position="right"
              :min="0"
            ></el-input-number>
            <el-button
              type="primary"
              size="medium"
              class="save-btn"
              @click="saveHandle"
            >
              保存
            </el-button>
            <el-button
              type="primary"
              size="medium"
              class="save-btn"
              @click="initialization"
            >
              初始化抽奖结果
            </el-button>
            <el-button
              type="primary"
              size="medium"
              class="save-btn"
              @click="calcPrizeArr(false)"
            >
              模拟抽奖结果
            </el-button>
          </el-form-item>
        </el-form>
        <el-timeline v-if="resultsShow" :hide-timestamp="true">
          <el-timeline-item v-for="(id, index) in results" :key="index">
            第{{ index + 1 }}次：{{ prizeMap[id] }}（
            <span v-if="id !== 0" style="color: red">中奖</span>
            <span v-else>未中奖</span>）
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Setting',

  data() {
    const prizes = [
      { id: 1, name: '一等奖', num: 2 },
      { id: 2, name: '二等奖', num: 4 },
      { id: 3, name: '三等奖', num: 6 },
      { id: 4, name: '安慰奖', num: 10 },
      { id: 5, name: '再来一次' },
      { id: 0, name: '新年快乐' },
    ]
    const prizeMap = {}
    prizes.forEach((prize) => {
      prizeMap[prize.id] = prize.name
    })

    const timesValidate = (rule, value, callback) => {
      if (value < this.totalPrizeNum) {
        callback(new Error('抽奖次数不能小于奖品数'))
      } else {
        callback()
      }
    }

    return {
      prizes,
      prizeMap,
      form: {
        times: 0,
      },
      resultsShow: false,
      results: [],
      rules: {
        times: [{ validator: timesValidate, trigger: 'change' }],
      },
    }
  },

  computed: {
    totalPrizeNum() {
      return this.prizes.reduce((prev, cur) => {
        const num = cur.num ? cur.num : 0
        return prev + num
      }, 0)
    },
  },

  mounted() {
    const times = localStorage.getItem('__times__')
    if (times) {
      this.form.times = times
    }
  },

  methods: {
    initialization() {
      this.calcPrizeArr(true)
    },

    async saveHandle() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      localStorage.setItem('__times__', this.form.times)
      this.$message.success({
        title: '成功',
        message: '保存成功',
        duration: 1000,
      })
    },

    calcPrizeArr(isSave) {
      if (this.form.times === 0) {
        this.$message.error({
          message: '请先设置抽奖次数',
          duration: 1000,
        })
        return
      }

      const arr = new Array(this.form.times)
      arr.fill(0)
      // 随机存入数组中
      this.prizes.forEach((prize) => {
        if (prize.num) {
          for (let i = 0; i < prize.num; i++) {
            let flag = true
            while (flag) {
              const pos = this.getRandomNum(this.form.times)
              if (arr[pos] === 0) {
                arr[pos] = prize.id
                flag = false
              }
            }
          }
        }
      })
      // 第一个有 50% 概率中奖
      const isGet = Math.random() < 0.5
      if (isGet && arr[0] === 0) {
        const firstIndex = arr.findIndex((item) => item !== 0)
        this.exchange(arr, 0, firstIndex)
      }
      // 进行平均分布
      this.arrAverage(arr)
      // 将 1 个 一等奖放入最后 10 个
      const lastOnePrizeIndex = arr.lastIndexOf(1)
      if (arr.length > 10 && lastOnePrizeIndex < arr.length - 10) {
        const random = this.getRandomNum(10)
        let start = arr.length - 1 - random
        while (arr[start] === 0) {
          start--
        }
        this.exchange(arr, lastOnePrizeIndex, start)
      }
      this.results = arr
      if (isSave) {
        localStorage.setItem('__results__', JSON.stringify(this.results))
        this.$message.success({
          message: '初始化成功',
          duration: 1000,
        })
      } else {
        this.resultsShow = true
      }
    },

    arrAverage(arr) {
      const inteval = Math.ceil(this.form.times / this.totalPrizeNum)
      for (let i = 0; i < arr.length - inteval + 1; i++) {
        const tempArr = arr.slice(i, i + 3)
        const sum = tempArr.reduce((a, b) => {
          return a + b
        }, 0)
        // 连续未中奖
        if (sum === 0) {
          // 与连续中奖的区段交换
          const index = this.getSeriousIndex(arr)
          this.exchange(arr, i + 1, index)
        }
      }
    },

    // 获取开始连续中奖的序号
    getSeriousIndex(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        if ((arr[i] !== 0) & (arr[i + 1] !== 0)) {
          return i + 1
        }
      }
    },

    exchange(arr, a, b) {
      if (a === undefined || b === undefined) return
      const temp = arr[a]
      arr[a] = arr[b]
      arr[b] = temp
    },

    getRandomNum(times) {
      return Math.floor(Math.random() * times)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  margin: 10px 20px 0;
}
.save-btn {
  margin-left: 40px;
}
</style>
