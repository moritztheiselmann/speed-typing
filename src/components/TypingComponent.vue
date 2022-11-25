<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTypingStore } from '@/stores/Typing'

const typingStore = useTypingStore();
const handleKeyUp = (event: KeyboardEvent) => {
  typingStore.validateCharacter(event.key);
}

const restart = (event: MouseEvent) => {
  typingStore.reset();
}

const stop = (event: MouseEvent) => {
  console.log('stop now;')
  typingStore.stop();
}

const typingInput = ref();
const handleClick = (event: MouseEvent) => {
  if (typingInput) {
    typingInput.value.focus();
  }
}

</script>

<template>
  <div 
    tabindex="0"
    class="typing-area"
    @keyup="handleKeyUp"
    @click="handleClick"
    v-if="typingStore.isIdle || typingStore.isStarted"
  >
    <div class="typing-input" ref="typingInput">
      <span
        v-for="character of typingStore.characters"
        :key="character.idx"
        :class="{
          'character--active' : (typingStore.getCurrentIndex() === character.idx && typingStore.isStarted),
          'character--valid' : (character.valid && character.valid !== undefined),
          'character--invalid' : (!character.valid && character.valid !== undefined),
          }"
        class="character"
      >
        {{ character.value }}
      </span>
    </div>
    <button
      :disabled="typingStore.isIdle"
      class="button"
      :class="{'button--disabled' : typingStore.isIdle}"
      @click="stop"
    >
      Stop   
    </button>
    <div class="typing-countdown">
      {{ typingStore.formattedTime }}s
    </div>
  </div>
  <div 
    v-else-if="typingStore.isFinished"
    class="typing-result"
  > 
    <p>
      Typed: {{ typingStore.getCurrentIndex() }} / {{ typingStore.characters.length }}
    </p>
    <p>
      Correct: {{ typingStore.correctRate() }} / {{ typingStore.getCurrentIndex() }}
    </p>
    <p>
      Erorr Rate: {{ typingStore.errorRate() }} / {{ typingStore.getCurrentIndex() }}
    </p>
    <p>
      Key
    </p>
    <button
      tabindex="0" 
      class="button"
      @click="restart"
    >
      Restart
    </button>
  </div>
</template>