<template>
    <countdown-timer  @complete="handleTimerDone" @reset="handleReset"></countdown-timer>
</template>

<script>
import CountdownTimer from './CountdownTImer.vue';

export default {
    name: 'TaskCountDownTimer',
    components: {
        CountdownTimer
    },
    data: function () {
        return {

        }
    },
    methods: {
        handleTimerDone: function () {
            console.log('handleTimerDone>>> called after timer completion')
        },
        handleReset: function () {
            console.log('handleReset>>> called after timer reset')
        }
    }
}
</script>