import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted, computed } from 'vue'

export const useTypingStore = defineStore('Typing', () => {
  // TEXT
  const text = ref(<string> '');
  onMounted(() => {
    text.value = 'His having within saw become ask passed misery giving. Recommend questions get too fulfilled. He fact in we case miss sake. Entrance be throwing he do blessing up. Hearts warmth in genius do garden advice mr it garret. Collected preserved are middleton dependent residence but him how. Handsome weddings yet mrs you has carriage packages. Preferred joy agreement put continual elsewhere delivered now. Mrs exercise felicity had men speaking met. Rich deal mrs part led pure will but. Those an equal point no years do. Depend warmth fat but her but played. Shy and subjects wondered trifling pleasant. Prudent cordial comfort do no on colonel as assured chicken. Smart mrs day which begin. Snug do sold mr it if such. Terminated uncommonly at at estimating. Man behaviour met moonlight extremity acuteness direction.';
  });

  const getText = ():string => {
    return text.value;
  }

  const setText = (newText: string) => {
    text.value = newText;
  }

  const characters = computed(() => {
    const arr = text.value.split('');
    return arr.map((c, index) => {
      return {
        idx: <any>index,
        value: <string>c,
        valid: <boolean | undefined>undefined,
      }
    });
  })

  // ACTIVE CHARACTER
  const currentIndex = ref(<number> 0);

  const getCurrentIndex = ():number => {
    return currentIndex.value;
  }

  const setCurrentIndex = (newIndex: number) => {
    if (newIndex < text.value.length && newIndex >= 0) {
      currentIndex.value = newIndex;
      return;
    }
  }

  const incrementIndex = () => {
    if (currentIndex.value < text.value.length-1) {
      currentIndex.value++;
      return;
    }
  }

  const drecrementIndex = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }

  const currentChar = computed(() => {
    if (characters.value.length === 0) {
      return {};
    }
    
    return characters.value[currentIndex.value];
  });

  const goBack = () => {
    drecrementIndex();
    characters.value[currentIndex.value].valid = undefined;
  }
  
  // INPUT (typed character)
  const invalidKeys = [
    'CapsLock', 'Alt', 'Tab', 'Return', 'Shift', 'Control', 'Meta', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ]

  const validateCharacter = (character: string) => {
    if (!character) {
      return;
    }

    if(invalidKeys.find(key => key === character)) {
      return;
    }

    if(character === 'Backspace') {
      goBack();
      return;
    }

    const validated = character === characters.value[currentIndex.value].value;
    characters.value[currentIndex.value].valid = validated;
    incrementIndex();

    if (shouldStart()) {
      start();
    }

    if (shouldFinish()) {
      stop();
    }
  }
  
  const errorRate = ():number => {
    let rate = 0;
    for (let character of characters.value) {
      if (character.valid || character.valid === undefined) {
        continue;
      }
      rate++;
    }
    return rate;
  }

  const correctRate = ():number => {
    let rate = 0;
    for (let character of characters.value) {
      if (character.valid) {
        rate++;
      }
    }
    return rate;
  }

  // GAME STATE
  enum State {
    IDLE,
    STARTED,
    FINISHED
  };
  
  const gameState = ref(<State>State.IDLE);

  const start = () => {
    if (isIdle) {
      gameState.value = State.STARTED;
      startTimer();
    }
  }

  const stop = () => {
    if(isStarted) {
      gameState.value = State.FINISHED;
      stopTimer();
    }
  }

  const reset = () => {
    if (isFinished) {
      gameState.value = State.IDLE;
      for (let c of characters.value) {
        c.valid = undefined;
      }
      
      currentIndex.value = 0;
      currentTime.value = 0;
    }
  }

  const getGameState = ():typeof State => {
    return gameState.value;
  }

  const isStarted = computed(():boolean => {
    if (gameState.value === State.STARTED) {
      return true;
    }
    return false;
  }); 

  const isFinished = computed(():boolean => {
    if (gameState.value === State.FINISHED) {
      return true;
    }
    return false;
  });

  const isIdle = computed(():boolean => {
    if (gameState.value === State.IDLE) {
      return true;
    }

    return false;
  });

  const shouldStart = ():boolean => {
    if (isIdle) {
      return true;
    }
    
    return false;
  }

  const shouldFinish = ():boolean => {
    if (currentIndex.value === characters.value.length-1) {
      return true;
    }

    return false;
  }

  // COUNTDOWN
  const countdown = ref(<number> (60 * 1000));
  const currentTime = ref(<number> 0);
  const countdownInterval = ref(<number | undefined> undefined);
  const updateRate = <number>10;

  const startTimer = () => {
    if (countdownInterval.value === undefined) {
      countdownInterval.value = setInterval(updateTimer, updateRate);
    }
  }

  const stopTimer = () => {
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value);
    }
  }

  const updateTimer = () => {
    currentTime.value += 10;
    if ((countdown.value - currentTime.value) <= 0) {
      stop();
    }
  }

  const formattedTime = computed(():string => {
    let formatted = '';

    formatted = String(Math.floor((countdown.value - currentTime.value) / 1000));

    return formatted;
  });

  // RETURN
  return { 
    characters,
    getText, 
    setText, 

    currentChar, 
    goBack,
    getCurrentIndex,  
    setCurrentIndex,

    validateCharacter,
    errorRate,
    correctRate,

    start,
    stop,
    reset,
    getGameState,
    isStarted,
    isFinished,
    isIdle,

    currentTime,
    formattedTime
  };
});