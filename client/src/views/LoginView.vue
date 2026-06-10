<script setup>
import {reactive, computed,ref} from "vue"
import {useRouter} from "vue-router";
import axios from "axios"

const router=useRouter()
const LOGIN_API_URL='http://localhost:4000/api/auth/login'

const form=reactive({
    email: "",
    password:''
})

const touched=reactive({
    email: false,
    password: false
})

const toast=reactive({
    show: false,
    message:''
})

const isSubmitting=ref(false)
let toastTimer

const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors=computed(() => {
    return {
        email:!form.email.trim()?'Email is required':!EMAIL_RE.test(form.email)?
                'Enter a valid email address':
            '',
        password: !form.password.trim()? 'Password is required':''
    }
})

const isValid=computed(() => {
    return Object.values(errors.value).every((el)=> !el)
})

function touch(field) {
    touched[field] = true
}

function showErrorToast(message) {
    toast.message=message
    toast.show=true

    clearTimeout(toastTimer)
    toastTimer=setTimeout(() => {
        toast.message=''
        toast.show=false
    },3000)
}

function getApiErrorMessage(error) {
    return error.response?.data?.message || error.message || 'Login Failed'
}

async function handleSubmit() {
    Object.keys(touched).forEach((k) => touched[k]=true)

    if (!isValid.value || isSubmitting.value) {
        return;
    }

    isSubmitting.value=true

    try {
        const response=await axios.post(LOGIN_API_URL, {
            email: form.email.trim(),
            password: form.password.trim()
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
    } catch (error) {
         showErrorToast(getApiErrorMessage(error))
    } finally {
        isSubmitting.value = false
    }

    // router.push('/login')
}

</script>

<template>
    <div class="auth-page">
        <Transition name="toast">
            <div v-if="toast.show" class="toast toast--error" role="alert">
                {{ toast.message }}
            </div>
        </Transition>
         <div class="auth-card">
            <div class="auth-card__body">
                <h1 class="auth-title">Welcome Back</h1>
                 <p class="auth-subtitle">Sign in to your account to continue.</p>

                 <form novalidate @submit.prevent="handleSubmit" >
                    <div class="form-group">
                        <label class="form-label" for="reg-email">Email</label>
                        <input id="reg-email" 
                        v-model="form.email" 
                        class="form-input"
                        :class="{'form-input--error': touched.email && errors.email}"
                        type="email"
                        placeholder="you@example.com"
                        autocomplete="email"
                        @blur="touch('email')" />
                        <p v-if="touched.email && errors.email" class="form-error" >
                            {{ errors.email }}
                        </p>
                    </div>

                     <div class="form-group">
                        <label class="form-label" for="reg-password">Password</label>
                        <input id="reg-password" 
                        v-model="form.password" 
                        class="form-input"
                        :class="{'form-input--error': touched.password && errors.password}"
                        type="password"
                        placeholder="At least 8 characters"
                        autocomplete="new-password"
                        @blur="touch('password')" />
                        <p v-if="touched.password && errors.password" class="form-error" >
                            {{ errors.password }}
                        </p>
                    </div>
                 </form>
            </div>
            <div class="auth-card__footer">
                 <button class="btn-primary"
                type="button" :disabled="isSubmitting" @click="handleSubmit" >
                {{ isSubmitting?'Logging In':'Log In' }}
            </button>
            <p class="auth-switch" >
                 Don't have an account?
                 <router-link to="/register" class="auth-link">
                    Register
                 </router-link>
            </p>
            </div>
         </div>
    </div>
</template>
