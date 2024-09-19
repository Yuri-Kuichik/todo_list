// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { collection, doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

import { useFirestore } from 'vuefire'
const db = useFirestore()

export const useGlobalStore = defineStore('global', {
  state() {
    return {
      todoList: [
        {
          text: 'do this',
          id: 1,
          completed: true
        },
        {
          text: 'do something',
          id: 2,
          completed: false
        },
        {
          text: 'do this',
          id: 3,
          completed: true
        },
        {
          text: 'do this',
          id: 4,
          completed: false
        },
        {
          text: 'do this',
          id: 5,
          completed: false
        },
      ],
      filteredTodoList: [],
      filter: 'all',
    }
  },
  
  getters: {
    getActiveTasks(state) {
      return state.todoList?.filter(item => !item.completed)
    },

    getCompletedTasks(state) {
      return state.todoList?.filter(item => item.completed)
    },

    isFilterAll: state => state.filter === 'all',

    isFilterActive: state => state.filter === 'active',

    isFilterCompleted: state => state.filter === 'completed',
  },

  actions: {
    async fetchTodoList() {
      const res = await $fetch('/api/todos')

      if (res?.data) {
        this.todoList = res.data
        
        if ( this.isFilterAll ) {
          this.setDefaultFilteredTodoList()
        }
      } 

      return res
    },

    async addNewTodo(text) {
      const res = await $fetch('/api/todos', {
        method: 'post',
        body: { text }
      })

      if (res?.data) {
        await this.fetchTodoList()

        if ( this.isFilterActive ) {
          this.setFilterActive()
        }
      } 

      return res
    },

    async editTodoItem(id, text) {
      console.log('editTodoItem')
      const res = await $fetch('/api/todos/edit-todo', {
        method: 'put',
        body: { text, id }
      })

      console.log(res)

      if (res?.data) {
        await this.fetchTodoList()

        if ( this.isFilterActive ) {
          this.setFilterActive()
        } else if (this.isFilterCompleted) {
          this.setFilterCompleted()
        }
      } 

      return res
    },

    setFilterAll() {
      console.log('setFilterAll')
      this.filter = 'all';
      this.setDefaultFilteredTodoList();
    },

    setFilterActive() {
      this.filter = 'active';
      this.filteredTodoList = this.getActiveTasks;
    },

    setFilterCompleted() {
      this.filter = 'completed';
      this.filteredTodoList = this.getCompletedTasks;
    },

    setDefaultFilteredTodoList() {
      this.filteredTodoList = this.todoList;
    },

    removeCompletedTasks() {
      this.todoList = this.todoList.reduce((acc, item) => {
        return item.completed ? acc : [...acc, item ]
      }, [])
    
      this.setDefaultFilteredTodoList()
    },

    setAllCompleted() {
      this.todoList = this.todoList.map((item) => {
        if(!item.completed) {
          item.completed = true
        }
        return item
      })
    },

    async deleteTodoItem(id) {
      const todoDocRef = doc(db, "todos", id)
      await deleteDoc(todoDocRef);

      this.todoList = this.todoList.filter(item => item.id !== id)
      this.setDefaultFilteredTodoList()
    },

    async setTaskCompleted(id) {
      const todoDocRef = doc(db, "todos", id)
      await updateDoc(todoDocRef, { completed: true });

      const index = this.todoList.findIndex(el => el.id === id)
      this.todoList[index].completed = true
      this.setDefaultFilteredTodoList()
    },

    
    
  }
})