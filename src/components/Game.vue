<template>
  <div class="box-block">
    <div class="header">
      <button @click="$router.push('/')">Back</button>
    </div>
    <div class="timer">
      {{ timerCount }}
    </div>
    <Expression
      ref="ExpressionRef"
      :complexity="gameOptions.complexity"
      :sum="gameOptions.summation"
      :dif="gameOptions.difference"
      :mul="gameOptions.multiplication"
      :div="gameOptions.division"
      :exp="gameOptions.exponentiation"
      @answer-correct="onAnswerCorrect"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Expression from './Expression.vue'

export default {
  name: 'GameComponent',

  components: {
    Expression,
  },

  data() {
    let timerInstance
    let gameOptions = {}
    let total = 0
    let passed = 0
    return {
      timerCount: '',
      timerInstance,
      gameOptions,
      total,
      passed,
    }
  },

  methods: {
    onStopGame() {
      // Отправляем информацию в дочерний компонент, что время игры закончилось
      this.$refs.ExpressionRef.onStop()
      clearInterval(this.timerInstance)
    },
    onAnswerCorrect(answer) {
      // Получаем информацию из дочернего компонента с результатами игры
      this.total = answer.total
      this.passed = answer.passed
      //console.log('Game -> answer total:', answer.total)
      //console.log('Game -> answer passed:', answer.passed)
    },
  },

  created() {
    const router = useRouter()
    // Читаем параметры из localStorage, если их нет - перебрасываем на экран с выбором параметров
    this.gameOptions =
      JSON.parse(localStorage.getItem('vc-game-options')) || router.push({ name: 'Options' })
  },

  mounted() {
    if (!this.gameOptions.duration) return
    let datetime = new Date(this.gameOptions.duration * 60 * 1000)

    this.timerInstance = setInterval(() => {
      if (datetime.getTime() == 0) {
        this.onStopGame()
      }
      this.timerCount =
        datetime.getUTCMinutes().toString().padStart(2, '0') +
        ':' +
        datetime.getSeconds().toString().padStart(2, '0')
      datetime.setTime(datetime.getTime() - 1000)
      //console.log('timerCount:', this.timerCount)
    }, 1000)
  },

  beforeUnmount() {
    this.onStopGame()
  },

  unmounted() {
    // Обновляем результаты игры и сохраняем в localStorage
    let savedResults = JSON.parse(localStorage.getItem('vc-game-results'))
    if (!savedResults) {
      savedResults = {}
      savedResults.startDate = new Date().toISOString().slice(0, 10)
      savedResults.daysCount = 0
      savedResults.overallTotal = 0
      savedResults.overallPassed = 0
    }
    savedResults.overallTotal += this.total
    savedResults.overallPassed += this.passed
    savedResults.lastTotal = this.total
    savedResults.lastPassed = this.passed
    const today = new Date().toISOString().slice(0, 10)
    if (savedResults.lastDate !== today) savedResults.daysCount += 1
    savedResults.lastDate = today
    localStorage.setItem('vc-game-results', JSON.stringify(savedResults))
  },
}
</script>

<style scoped>
.timer {
  margin: 20px;
  padding: 12px 20px 12px 20px;
  position: absolute;
  border-radius: 5%;
  user-select: none;
  top: 0;
  right: 0;
  min-width: 40px;
  min-height: 20px;
  color: rgb(255, 255, 255);
  font-weight: bold;
  background-color: rgb(58, 58, 58);
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
}
</style>
