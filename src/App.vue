<template>
  <router-view />
</template>

<!--template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <router-link to="/profile">Profile</router-link>
  </div>
  <router-view/>
</template-->

<script>
/* eslint-disable */
import Options from './components/Options.vue'
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Options,
    Game,
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

html {
  font-family: 'Roboto', sans-serif;
}

.box-block {
  margin: 80px;
  padding: 50px;
  max-width: 500px;
  height: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  color: rgb(60, 55, 80);
  background-color: #f8f9fa;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  position: relative;
}

.footer {
  padding: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.header {
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
}

button {
  align-items: center;
  background-color: #f7f7f7;
  border: 1px solid rgba(175, 175, 175, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  box-sizing: border-box;  
  user-select: none;
  color: rgba(0, 0, 0, 0.95);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 250ms;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
}

button:hover{
  border: 1px solid rgba(0, 0, 0, 0.4);
}

button:active {
  transform: translateY(1px) translateX(1px);
}
</style>
