<template>
  <div class="box-block">
    <h2>Привет!</h2>
    <p>Добро пожаловать на {{ gameResults.daysCount }} тренировочный день,</p>
    <p>
      Ваш последний результат: решено {{ gameResults.lastPassed }} из {{ gameResults.lastTotal }}.
    </p>
    <p>Общая точность: {{ gameResults.accuracy }}.</p>
    <div><h3>Настройки</h3></div>
    <div class="box-range">
      <input
        type="range"
        id="range_duration"
        min="1"
        max="15"
        step="1"
        v-model="gameOptions.duration"
      />
      <div>
        <label for="range_duration">Длительность: {{ gameOptions.duration }} мин.</label>
      </div>
    </div>
    <div class="box-range">
      <input
        type="range"
        id="range_complex"
        min="1"
        max="10"
        step="1"
        v-model="gameOptions.complexity"
      />
      <div>
        <label for="range_complex">Сложность: {{ gameOptions.complexity }}</label>
      </div>
    </div>

    <div class="box-check">
      <input
        type="checkbox"
        id="checkbox_sum"
        name="checkbox_sum"
        v-model="gameOptions.summation"
      />
      <label for="checkbox_sum">Суммирование</label>
    </div>
    <div class="box-check">
      <input
        type="checkbox"
        id="checkbox_dif"
        name="checkbox_dif"
        v-model="gameOptions.difference"
      />
      <label for="checkbox_dif">Разность</label>
    </div>
    <div class="box-check">
      <input
        type="checkbox"
        id="checkbox_mul"
        name="checkbox_mul"
        v-model="gameOptions.multiplication"
      />
      <label for="checkbox_mul">Умножение</label>
    </div>
    <div class="box-check">
      <input type="checkbox" id="checkbox_div" name="checkbox_div" v-model="gameOptions.division" />
      <label for="checkbox_div">Деление</label>
    </div>
    <div class="box-check">
      <input
        type="checkbox"
        id="checkbox_exp"
        name="checkbox_exp"
        v-model="gameOptions.exponentiation"
      />
      <label for="checkbox_exp">Возведение в степень</label>
    </div>

    <div class="footer">
      <button @click="onClickPlay">Play!</button>
    </div>
  </div>
</template>

<script>
import { reactive, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'OptionsComponent',
  setup() {
    const gameOptions = reactive({})
    const gameResults = reactive({ daysCount: 0, lastTotal: 0, lastPassed: 0, accuracy: 0 })

    const router = useRouter()
    const onClickPlay = () => {
      // Проверяем, что выбрана хотя бы одна операция
      if (Object.values(gameOptions).indexOf(true) > -1) {
        // Сохраняем выбранные параметры в localStorage
        localStorage.setItem('vc-game-options', JSON.stringify(gameOptions))
        router.push({ name: 'Game' })
      } else alert('Нужно выбрать хотя бы одну математическую операцию')
    }

    onMounted(() => {
      // Читаем параметры из localStorage, если их нет, то используем параметры по умолчанию
      Object.assign(
        gameOptions,
        JSON.parse(localStorage.getItem('vc-game-options')) || {
          duration: '2',
          complexity: '8',
          summation: true,
          difference: false,
          multiplication: false,
          division: false,
          exponentiation: false,
        }
      )
      // Читаем результаты пользователя из localStorage
      let savedResults = JSON.parse(localStorage.getItem('vc-game-results'))
      if (savedResults) {
        gameResults.daysCount = savedResults.daysCount
        gameResults.lastTotal = savedResults.lastTotal
        gameResults.lastPassed = savedResults.lastPassed
        gameResults.accuracy =
          Math.floor((100 * savedResults.overallPassed) / savedResults.overallTotal) + '%'
      }
    })
    onBeforeUnmount(() => {})
    return {
      gameOptions,
      gameResults,
      onClickPlay,
    }
  },
}
</script>

<style scoped>
.box-check {
  padding-top: 15px;
}

label {
  font-size: 0.9rem;
  padding-left: 8px;
}

input[type='range'] {
  margin: 20px 0 10px 0;
  min-width: 200px;
}

input {
  margin-top: 8px;
}

h2 {
  margin-top: 0;
}

h3 {
  margin: 60px 0 5px 0;
}

p {
  margin: 4px 0;
}
</style>
