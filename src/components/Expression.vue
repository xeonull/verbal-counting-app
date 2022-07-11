<template>
  <div class="calc" :class="active ? '' : 'disabledbuttons'">
    <div class="display">
      <p>
        {{ expression.a }} {{ expression.op1 == '**' ? '^' : expression.op1 }}
        <input
          ref="inputBox1"
          type="text"
          @focus="onFocus"
          v-model="expression.b"
          :maxlength="inputMaxLength"
          :disabled="!active"
        />
        <template v-if="useThirdOperand"
          >&nbsp;{{ expression.op2 == '**' ? '^' : expression.op2 }}
          <input
            ref="inputBox2"
            type="text"
            @focus="onFocus"
            v-model="expression.c"
            :maxlength="inputMaxLength"
            :disabled="!active"
          /> </template
        >&nbsp;=&nbsp;{{ expression.d }}
      </p>
    </div>
    <div class="buttons">
      <div id="n1" class="btn one btn-orange" @click="onNumberInput">1</div>
      <div id="n2" class="btn two btn-orange" @click="onNumberInput">2</div>
      <div id="n3" class="btn three btn-orange" @click="onNumberInput">3</div>
      <div class="btn lt" @click="onFocusLeft">&lt;</div>
      <div id="n4" class="btn four btn-orange" @click="onNumberInput">4</div>
      <div id="n5" class="btn five btn-orange" @click="onNumberInput">5</div>
      <div id="n6" class="btn six btn-orange" @click="onNumberInput">6</div>
      <div class="btn gt" @click="onFocusRight">&gt;</div>
      <div id="n7" class="btn seven btn-orange" @click="onNumberInput">7</div>
      <div id="n8" class="btn eight btn-orange" @click="onNumberInput">8</div>
      <div id="n9" class="btn nine btn-orange" @click="onNumberInput">9</div>
      <div class="btn question" :class="result ? 'disable' : ''" v-on:click="onNextWrong">?</div>
      <div class="none"></div>
      <div id="n0" class="btn zero btn-orange" @click="onNumberInput">0</div>
      <div class="none"></div>
      <div class="btn equal" :class="result ? 'btn-green' : 'disable'" v-on:click="onNextRight">
        =
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from 'vue'
export default {
  name: 'ExpressionComponent',

  props: {
    complexity: String,
    sum: Boolean,
    dif: Boolean,
    mul: Boolean,
    div: Boolean,
    exp: Boolean,
  },

  setup(props, context) {
    const inputMaxLength = 4
    const expression = reactive({ a: 0, op1: '+', b: 0, op2: '+', c: 0, d: 0 })
    let useThirdOperand = ref(false)
    let result = ref(true)
    let active = ref(true)
    let expTotal = 0
    let expPassed = 0
    // Берем из параметров, только те опции, значения которых равны true
    const selOperators = Object.entries(props)
      .filter((v) => v[1] === true)
      .map((v) => v[0])

    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const next = () => {
      useThirdOperand.value = props.complexity > 5 ? true : false
      const operator = random(1, selOperators.length) - 1
      switch (selOperators[operator]) {
        case 'sum':
          expression.op1 = expression.op2 = '+'
          expression.a = random(1 * props.complexity ** 2, 10 * props.complexity ** 2)
          expression.d = random(10 * props.complexity ** 2, 100 * props.complexity ** 2)
          expression.b = Math.floor((expression.d - expression.a) / 2)
          expression.c = expression.d - expression.a - expression.b
          break
        case 'dif':
          expression.op1 = expression.op2 = '-'
          expression.a = random(10 * props.complexity ** 2, 100 * props.complexity ** 2)
          expression.d = random(1 * props.complexity ** 2, 10 * props.complexity ** 2)
          expression.b = Math.floor((expression.a - expression.d) / 2)
          expression.c = expression.a - expression.d - expression.b
          break
        case 'mul':
          expression.op1 = expression.op2 = '*'
          expression.a = random(1, 12 * props.complexity)
          expression.b = random(1, 12 * props.complexity)
          expression.c = random(1, 12 * props.complexity)
          expression.d = expression.a * expression.b * expression.c
          break
        case 'div':
          expression.op1 = expression.op2 = '/'
          expression.d = random(1, 10 * props.complexity)
          expression.b = random(1, 10 * props.complexity)
          expression.c = random(1, 10 * props.complexity)
          expression.a = expression.d * expression.b * expression.c
          break
        case 'exp':
          useThirdOperand.value = false
          expression.op1 = expression.op2 = '**'
          expression.a = random(Math.floor(props.complexity / 2) + 2, 2 * props.complexity + 3)
          expression.b = random(Math.floor(props.complexity / 2) + 2, 1 * props.complexity + 2)
          expression.d = expression.a ** expression.b
          break
      }
      console.log('b:', expression.b)
      if (useThirdOperand.value) console.log('c:', expression.c)
      expression.b = ''
      expression.c = ''
    }
    let inputBoxFocused = null
    const inputBox1 = ref(null)
    const inputBox2 = ref(null)

    const onNextRight = () => {
      if (!result.value) return
      next()
      expTotal++
      expPassed++
    }

    const onNextWrong = () => {
      if (result.value) return
      next()
      expTotal++
    }

    const onFocusLeft = () => {
      inputBox1.value.focus()
    }

    const onFocusRight = () => {
      inputBox2.value.focus()
    }

    const isInteger = (val) => {
      return val % 1 == 0
    }

    const onNumberInput = (e) => {
      if (inputBoxFocused == inputBox1.value && expression.b.toString().length < inputMaxLength)
        expression.b = expression.b + e.target.innerText
      else if (
        inputBoxFocused == inputBox2.value &&
        expression.c.toString().length < inputMaxLength
      )
        expression.c = expression.c + e.target.innerText
    }

    const onFocus = (e) => {
      inputBoxFocused = e.target
    }

    const onStop = () => {
      // Получаем информацию от родительского компонента, что время вышло и отправляем результат
      context.emit('answer-correct', { total: expTotal, passed: expPassed })
      active.value = false
    }

    watch(expression, () => {
      if (!useThirdOperand.value) expression.c = 0
      if (isInteger(expression.b) && isInteger(expression.c)) {
        let ev_3th = useThirdOperand.value ? `${expression.op2}${+expression.c}` : ``
        let ev = `${expression.a}${expression.op1}${+expression.b}${ev_3th} == ${expression.d}`
        result.value = eval(ev)
      }
    })

    onMounted(() => {
      next()
      inputBoxFocused = inputBox1.value
    })

    return {
      expression,
      result,
      active,
      useThirdOperand,
      inputMaxLength,
      inputBox1,
      inputBox2,
      next,
      onFocusLeft,
      onFocusRight,
      onNumberInput,
      inputBoxFocused,
      onFocus,
      onStop,
      expTotal,
      expPassed,
      onNextRight,
      onNextWrong,
      isInteger,
    }
  },
}
</script>

<style scoped>
input[type='text'] {
  background: transparent;
  border: none;
  outline: none;
  font-size: 2rem;
  text-align: center;
  border-bottom: 2px solid #000;
  width: 20%;
}

.calc {
  margin: 42px auto;
  width: 400px;
  color: #fff;
}

.display {
  padding: 20px;
  height: 100px;
  display: grid;
  justify-items: center;
  text-align: center;
  font-size: 2rem;
  color: rgb(124, 124, 124);
  font-weight: bold;
}

.buttons {
  padding: 18px 36px;
  display: grid;
  grid-template-areas:
    'one two three lt'
    'four five six gt'
    'seven eight nine question'
    'nl zero nr equal';
  grid-gap: 28px;
  justify-items: center;
}

.btn {
  width: 60px;
  height: 60px;
  background: #333;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  font-size: 1.5rem;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.4) 0 4px 12px;
  transition: all 250ms;
  cursor: pointer;
}
.disable {
  opacity: 0.4;
  pointer-events: none;
}
.btn:hover:not(.disable) {
  filter: brightness(120%);
}
.btn:active:not(.disable) {
  filter: brightness(90%);
  transform: translateY(1px) translateX(1px);
}
.btn.btn-orange {
  background: rgb(250, 120, 44);
}
.btn.btn-green {
  background: rgb(34, 197, 143);
}
.disabledbuttons {
  pointer-events: none;
  opacity: 0.4;
}
</style>
