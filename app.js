Vue.component('greeting', {
    template: `<p>Hey there, I am {{name}}. <button v-on:click="changeName">Change Name</button></p>`,
    data: function () {
        return {
            name: 'Rohith'
        }
    },
    methods: {
        changeName: function () {
            this.name = 'Codevolution'
        }
    }
})

new Vue({
    el: "#vue-app",
    data: {
        name: 'rohith',
        website: 'https://www.youtube.com/watch?v=xIOwFTCBBDg&list=PL4cUxeGkcC9gQcYgjhBoeQH7wiAyZNrYa&index=5',
        websiteTag: `<a href="https://www.youtube.com/watch?v=xIOwFTCBBDg&list=PL4cUxeGkcC9gQcYgjhBoeQH7wiAyZNrYa&index=5" >Another way to represent data</a>`,
        age: 27,
        x: 0,
        y: 0,
        InputName: '',
        InputAge: '',
        a: 0,
        b: 0,
        isAvailable: false,
        isNearby: false,
        characters: ['Mario', 'Luigi', 'Yoshi', 'Bowser'],
        ninjas: [
            { name: 'Ryu', age: 25 },
            { name: 'Yoshi', age: 35 },
            { name: 'Ken', age: 55 }
        ]
    },
    methods: {
        greet: function (time) {
            return `Good ${time} ${this.name}`
        },
        AddAge: function (val) {
            this.age = this.age + val
            return this.age
        },
        SubtractAge: function (val) {
            this.age = this.age - val
            return this.age
        },
        UpdateXY: function (event) {
            console.log(event)
            this.x = event.offsetX;
            this.y = event.offsetY;
        },
        clickAnchorTag: function () {
            alert('u clicked the tag')
        },
        logName: function () {
            console.log('you entered your name');
        },
        logAge: function () {
            console.log('you entered your age');
        },
        DynamicClass: function () {
            this.isAvailable = !this.isAvailable;
            this.isNearby = !this.isNearby;
        },
    },
    computed: {
        addToA: function () {
            console.log('addToA');
            return this.a + this.age;
        },
        addToB: function () {
            console.log('addToB');
            return this.b + this.age;
        },
        computedClasses: function () {
            return {
                available: this.isAvailable,
                nearby: this.isNearby
            }
        }
    }
})


var one = new Vue({
    el: "#vue-app-one",
    data: {
        title: 'Vue App One',
        name: ''
    },
    methods: {
        submitName: function () {
            this.name = this.$refs.nameInput.value;
        }
    }
})

var two = new Vue({
    el: "#vue-app-two",
    data: {
        title: 'Vue App Two'
    },
    methods: {
        changeOneTitle: function () {
            one.title = "Title Changed"
        }
    },
})