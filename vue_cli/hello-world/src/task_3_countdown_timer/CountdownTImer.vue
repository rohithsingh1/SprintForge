<template>
    <div class="countdown-page">
        <div class="card">

            <!-- Setup Form -->
            <template v-if="!isFormSubmitted">
                <div class="card-header">
                    <p class="eyebrow">Countdown Timer</p>
                    <h1>Set your timer</h1>
                    <p class="subtitle">Enter hours, minutes, and seconds</p>
                </div>

                <div class="fields">
                    <div class="field">
                        <label for="hours">Hours</label>
                        <input type="number" min="0" max="99" id="hours" placeholder="00" v-model.number="formFields.hours" />
                    </div>
                    <span class="separator">:</span>
                    <div class="field">
                        <label for="minutes">Minutes</label>
                        <input type="number" min="0" max="59" id="minutes" placeholder="00" v-model.number="formFields.minutes" />
                    </div>
                    <span class="separator">:</span>
                    <div class="field">
                        <label for="seconds">Seconds</label>
                        <input type="number" min="0" max="59" id="seconds" placeholder="00" v-model.number="formFields.seconds" />
                    </div>
                </div>

                <button
                    class="btn btn-primary"
                    :disabled="!isSubmitButtonEnabled"
                    v-tooltip="isSubmitButtonEnabled ? 'Start the countdown' : 'Enter at least one value above 0'"
                    @click="formSubmitHandler"
                >
                    Start Timer
                </button>
            </template>

            <!-- Timer Display -->
            <template v-else>
                <div class="card-header">
                    <p class="eyebrow">Countdown Timer</p>
                    <p class="status-label" :class="isRunning ? 'running' : 'paused'">
                        {{ isRunning ? 'Running' : 'Paused' }}
                    </p>
                </div>

                <div class="timer-display">
                    <div class="time-block">
                        <span class="time-value">{{ String(renderCountDownTimer.hours).padStart(2, '0') }}</span>
                        <span class="time-label">Hours</span>
                    </div>
                    <span class="time-separator">:</span>
                    <div class="time-block">
                        <span class="time-value">{{ String(renderCountDownTimer.minutes).padStart(2, '0') }}</span>
                        <span class="time-label">Minutes</span>
                    </div>
                    <span class="time-separator">:</span>
                    <div class="time-block">
                        <span class="time-value">{{ String(renderCountDownTimer.seconds).padStart(2, '0') }}</span>
                        <span class="time-label">Seconds</span>
                    </div>
                </div>

                <div class="actions">
                    <button
                        class="btn btn-secondary"
                        v-tooltip="isRunning ? 'Pause the countdown' : 'Resume the countdown'"
                        @click="pauseStartCountDownTimer"
                    >
                        {{ isRunning ? 'Pause' : 'Resume' }}
                    </button>
                    <button
                        class="btn btn-ghost"
                        v-tooltip="{ text: 'Clear and start over', position: 'bottom' }"
                        @click="resetTimerHandler"
                    >
                        Reset
                    </button>
                </div>
            </template>

        </div>
    </div>
</template>

<script>

const HOURS_VALUE = 60 * 60
const MINUTES_VALUE = 60

export default {
    name: 'CountdownTimer',
    data: function () {
        return {
            totalDuration: 0,
            formFields: {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            isFormSubmitted: false,
            isRunning: false,
        }
    },
    methods: {
        formSubmitHandler: function () {
            this.totalDuration = (this.formFields.hours * HOURS_VALUE) + (this.formFields.minutes * MINUTES_VALUE) + this.formFields.seconds
            this.isFormSubmitted = true
            this.isRunning = true
        },
        pauseStartCountDownTimer: function () {
            this.isRunning = !this.isRunning
        },
        resetTimerHandler: function () {
            this.isRunning = false
            this.totalDuration = 0
            this.isFormSubmitted = false
            this.formFields = { hours: 0, minutes: 0, seconds: 0 }  // also cleaner
            this.$emit('reset')
        }
    },
    created() {
        this.intervalRef = null   // not in data()
    },
    computed: {
        renderCountDownTimer: function () {
            const hours = Math.floor(this.totalDuration / HOURS_VALUE)
            const remainingTimeAfterHours = this.totalDuration % HOURS_VALUE
            const minutes = Math.floor(remainingTimeAfterHours / MINUTES_VALUE)
            const seconds = remainingTimeAfterHours % MINUTES_VALUE
            return { hours, minutes, seconds }
        },
        isSubmitButtonEnabled: function () {
            const { hours, minutes, seconds } = this.formFields
            return (
                    (hours > 0 || minutes > 0 || seconds > 0) &&
                    hours >= 0 && minutes >= 0 && seconds >= 0 &&
                    minutes < 60 && seconds < 60 &&
                    Number.isInteger(hours) && Number.isInteger(minutes) && Number.isInteger(seconds)
                )
            }
        },
    watch: {
        isRunning: function (newVal) {
            if (newVal) {
                this.intervalRef = setInterval(() => {
                    if (this.totalDuration <= 1) {
                        this.totalDuration = 0
                        this.isRunning = false
                        this.$emit('complete')
                    } else {
                        this.totalDuration -= 1
                    }
                }, 1000)
            } else {
                clearInterval(this.intervalRef)
                this.intervalRef = null
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.intervalRef)
    }
}
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────── */
.countdown-page {
    align-items: center;
    background: linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 40px 20px;
}

/* ── Card ────────────────────────────────────────────────── */
.card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
    padding: 48px 40px;
    text-align: center;
    width: 100%;
    max-width: 480px;
}

/* ── Header ──────────────────────────────────────────────── */
.card-header {
    margin-bottom: 36px;
}

.eyebrow {
    color: #40b883;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

h1 {
    color: #f1f5f9;
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
}

.subtitle {
    color: #64748b;
    font-size: 14px;
}

/* ── Status badge ────────────────────────────────────────── */
.status-label {
    display: inline-block;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 14px;
    text-transform: uppercase;
}

.status-label.running {
    background: rgba(64, 184, 131, 0.15);
    color: #40b883;
}

.status-label.paused {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
}

/* ── Form fields row ─────────────────────────────────────── */
.fields {
    align-items: flex-end;
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 32px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field label {
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.field input {
    background: #0f172a;
    border: 1.5px solid #334155;
    border-radius: 12px;
    color: #f1f5f9;
    font-size: 28px;
    font-weight: 700;
    height: 72px;
    outline: none;
    text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 80px;
    /* hide spinners */
    -moz-appearance: textfield;
}

.field input::-webkit-outer-spin-button,
.field input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.field input::placeholder {
    color: #334155;
}

.field input:focus {
    border-color: #40b883;
    box-shadow: 0 0 0 3px rgba(64, 184, 131, 0.15);
}

.separator {
    color: #475569;
    font-size: 28px;
    font-weight: 700;
    line-height: 72px;
    padding-bottom: 4px;
}

/* ── Timer display ───────────────────────────────────────── */
.timer-display {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 40px;
}

.time-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.time-value {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 14px;
    color: #f1f5f9;
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
    min-width: 100px;
    padding: 16px 12px;
    font-variant-numeric: tabular-nums;
}

.time-label {
    color: #475569;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.time-separator {
    color: #334155;
    font-size: 44px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 24px;
}

/* ── Buttons ─────────────────────────────────────────────── */
.actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn {
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    padding: 13px 28px;
    transition: background 0.2s, transform 0.15s, opacity 0.2s;
}

.btn:active {
    transform: scale(0.97);
}

.btn-primary {
    background: #40b883;
    color: #fff;
    width: 100%;
    padding: 15px;
    font-size: 16px;
    border-radius: 12px;
}

.btn-primary:hover:not(:disabled) {
    background: #2f9d6d;
}

.btn-primary:disabled {
    background: #1e3a2f;
    color: #2f6a4e;
    cursor: not-allowed;
}

.btn-secondary {
    background: #40b883;
    color: #fff;
    flex: 1;
}

.btn-secondary:hover {
    background: #2f9d6d;
}

.btn-ghost {
    background: #0f172a;
    border: 1.5px solid #334155;
    color: #94a3b8;
    flex: 1;
}

.btn-ghost:hover {
    background: #1e293b;
    border-color: #475569;
    color: #cbd5e1;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 480px) {
    .card {
        padding: 32px 20px;
    }

    .time-value {
        font-size: 36px;
        min-width: 72px;
        padding: 12px 8px;
    }

    .time-separator {
        font-size: 30px;
    }

    .field input {
        font-size: 22px;
        width: 66px;
        height: 60px;
    }
}
</style>
