<script setup>
import { shallowRef, computed } from 'vue'

const globalStore = useGlobalStore();
const { todoList } = storeToRefs(globalStore);

const inputText = shallowRef('');
const loading = shallowRef(false);

const isInputText = computed(() => {
  return !!inputText.value.length
})

const isTodos = computed(() => {
  return !!todoList.value.length
})

useHead(() => ({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/todo-list-illustration.png',
    },
  ],
}));

async function addNewTodo() {
  loading.value = true

  await globalStore.addNewTodo(inputText.value)
  inputText.value = ''
  console.log('finish addNewTodo')

  loading.value = false
}

async function fetch() {
  loading.value = true;

  await globalStore.fetchTodoList()

  loading.value = false;
}


// onMounted(async() => {
//   await fetch()
// })

// const res = await useAsyncData(async () => await globalStore.fetchTodoList())

// const res = await useAsyncData(async () => await fetch())
const res = await useFetch(async () => await fetch())

</script>

<template>
  <div class="home-page">
    <div class="home-page__header">
      <NuxtImg
        class="home-page__image" 
        src="/images/todo-list-illustration.png" 
      />
      <h2 class="home-page__title">Today I need to</h2>
      <div class="home-page__input-wrapper">
        <el-input 
          :class="$style['el-input']"
          v-model="inputText" 
          placeholder="Add new todo..." 
          size="large"
          @keyup.enter="addNewTodo"
          clearable
        />
        <el-button 
          v-if="isInputText"
          :class="$style['el-button']"
          @click="addNewTodo" 
          type="primary"
          size="large"
          :loading="loading"
          :disabled="loading"
        >
          Добавить
        </el-button>
      </div>
    </div>

    <SharedLoadingSpinner class="home-page__spinner" v-if="loading" size="l" />
    <template v-else>
      <div v-if="isTodos" class="home-page__content">
        <TodoList/>
        <TodoListActions />
        <TodoListProgressBar />
      </div>

      <div v-else class="home-page__no-tasks">
        <NuxtImg
          height="24"
          class="home-page__image" 
          src="/images/checkmark.svg" 
        />
        <span>Congrat, you have no more tasks to do</span>
      </div>

    </template>
  </div>

</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  gap: 32px;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
  }

  &__image {
    max-width: 180px;
  }

  &__input-wrapper {
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    line-height: 1.2;
  }

  &__no-tasks {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    line-height: 1.15;
    color: var(--color-gray);
  }

  &__spinner {
    flex-grow: 1;
  }

  @media (min-width: 768px) {
    gap: 48px;

    &__header {
      gap: 48px;
    }

    &__content {
      gap: 40px;
    }
  }

}
</style>

<style lang="scss" module scoped>
.el-input {
  flex-grow: 1;
  max-width: 317px;
  --el-input-border-radius: var(--radius);

  @media (max-width: 767px) {
    --el-component-size-large: 32px;
  }
}

.el-button {
  --el-border-radius-base: var(--radius);
  padding-left: 30px;
  padding-right: 30px;

  @media (max-width: 767px) {
    --el-button-size: 32px;
  }
}
</style>
