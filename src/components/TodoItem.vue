<script setup>
import { shallowRef, computed } from 'vue';
import {
  Check,
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import { log } from 'firebase-functions/logger';

const globalStore = useGlobalStore();
const open = shallowRef(false);
const loading = shallowRef(false);

const props = defineProps({
  model: {
    type: Object,
    default: {}
  }
})

const newText = shallowRef(props.model.text)

const rootClasses = computed(() => {
  return {
    'todo-item_completed': props.model.completed
  }
})

function deleteTask() {
  globalStore.deleteTodoItem(props.model.id)
}

function setTaskCompleted() {
  globalStore.setTaskCompleted(props.model.id)
}

function openModal() {
  newText.value = props.model.text
  open.value = true
}

function closeModal() {
  open.value = false
  newText.value = ''
}

async function editTask() {
  const todo = globalStore.todoList.find(item => item.id === props.model.id)
  
  // if (todo.text === props.model.text) { 
  //   console.log('todo.text: ', todo.text)
  //   console.log('props.model.text: ', props.model.text)

  //   return 
  // }

  loading.value = true

  await globalStore.editTodoItem(props.model.id, newText.value)
  closeModal()

  loading.value = false
}

</script>

<template>
  <div class="todo-item" :class="rootClasses">
    <p>
      {{ model.id + ': ' + model.text }}
    </p>

    <div>
      <el-button @click="openModal" type="primary" :icon="Edit" circle />
      <el-button @click="setTaskCompleted" :disabled="model.completed" type="success" :icon="Check" circle />
      <el-button @click="deleteTask" type="danger" :icon="Delete" circle />
    </div>

    <SharedBoxModal v-if="open" @close="closeModal">
      <template #header>Edit todo</template>
      <el-input v-model="newText"  placeholder="Edit todo..." />
      <template #footer>
        <el-button 
          class="modal-btn" 
          type="primary" 
          @click="editTask"
          :loading="loading"
          :disabled="loading"
        >
          Edit
        </el-button>
        <el-button 
          class="modal-btn" 
          @click="closeModal" 
          :disabled="loading"
        >
          Close
        </el-button>
      </template>
    </SharedBoxModal>
    
  </div>
</template>

<style lang="scss" scoped>
.todo-item {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-white);

  &_completed {
    background: var(--el-color-success-light-8);
  }

  @media (min-width: 768px) {
    padding: 8px 12px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.modal-btn {
  margin: 0;
  width: 50%;
}
    
</style>