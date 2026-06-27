<template>
    <div>
        <h1>Todo List</h1>
        <div>
            <input type="text" placeholder="Add a task" v-model="todoTitle" />
            <button :disabled="todoTitle.trim().length === 0" @click="isEditing ? editTodo() : addTodo()">{{
                showButtonText }}</button>
        </div>
        <div>
            <p v-if="todoList.length === 0">No Task to do</p>
            <ul v-else-if="todoList.length > 0">
                <li v-for="(todo, index) in todoList" :key="todo.id">
                    <span>{{ todo.title }}</span>
                    <button @click="deleteTodoClickHandler(index)">Delete</button>
                    <button @click="editClickHandler(todo, index)">Edit Todo</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    data: function () {
        return {
            todoList: [],
            todoTitle: '',
            isEditing: false,
            isEditingTodoIndex: -1
        }
    },
    methods: {
        addTodo: function () {
            const self = this
            if (self.todoTitle.trim().length === 0) {
                alert('title can not be empty..')
                return;
            }
            const todoObj = {
                title: self.todoTitle.trim(),
                id: new Date().getTime()
            }
            self.todoList.push(todoObj)
            self.todoTitle = ''
            self.isEditing = false
            self.isEditingTodoIndex = -1
        },
        editTodo: function () {
            const self = this
            const editingTodo = self.todoList[self.isEditingTodoIndex]
            const todoObj = {
                ...editingTodo,
                title: self.todoTitle.trim(),
            }
            self.todoList.splice(self.isEditingTodoIndex, 1, todoObj)
            self.isEditing = false
            self.isEditingTodoIndex = -1
            self.todoTitle = ''
        },
        deleteTodoClickHandler: function (index) {
            const self = this
            self.todoList.splice(index, 1)
            self.isEditing = false
            self.isEditingTodoIndex = -1
        },
        editClickHandler: function (todo, index) {
            const self = this
            self.todoTitle = todo.title
            self.isEditing = true
            self.isEditingTodoIndex = index
        }
    },
    computed: {
        showButtonText: function () {
            return this.isEditing
                ? 'Update Task' : 'Add task'
        }
    }
}

</script>

<style scoped></style>