<script setup>
import {reactive, computed, ref} from "vue"
import {useRouter} from "vue-router"
import axios from "axios"

const router=useRouter()
const REGISTER_API_URL='http://localhost:4000/api/auth/register'

const form=reactive({
    name: '',
    email: "",
    password: '',
    confirmPassword: ''
})

const touched=reactive({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
})

const toast=reactive({
    show: false,
    message: '',
})
const isSubmitting=ref(false)
let toastTimer

const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors=computed(() => {
    return {
        name: !form.name.trim()? "Name is required":'',
        email: !form.email.trim()? 'Email is required':
            !EMAIL_RE.test(form.email)?
                'Enter a valid email address':
                '',
        password: !form.password? 'Password is required':
            form.password.length<8? "Password must be at least 8 characters":'',
        confirmPassword: !form.confirmPassword ? 'Please confirm your password': form.confirmPassword !== form.password
    ? 'Passwords do not match'
    : '',
    }
})

const isValid=computed(() => Object.values(errors.value).every((e) => !e))

function touch(field) {
  touched[field] = true
}

function showErrorToast(message) {
    toast.message=message
    toast.show=true

    window.clearTimeout(toastTimer)
    toastTimer=window.setTimeout(() => {
        toast.show=false
        toast.message=''
    }, 3000)
}

function getApiErrorMessage(error) {
    return error.response?.data?.message || error.message || 'Registration failed'
}

async function handleSubmit() {
    // Mark all fields as touched to reveal any hidden errors
    Object.keys(touched).forEach((k) => (touched[k]=true));

    if (!isValid.value || isSubmitting.value) {
        return;
    }

    isSubmitting.value=true

    try {
        await axios.post(REGISTER_API_URL, {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: 'MEMBER',
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        router.push('/login')
    } catch (error) {
        showErrorToast(getApiErrorMessage(error))
    } finally {
        isSubmitting.value=false
    }
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
                <h1 class="auth-title">Create account</h1>
                 <p class="auth-subtitle">Enter your details to get started.</p>

                 <form @submit.prevent="handleSubmit" >
                     <div class="form-group">
                         <label class="form-label" for="reg-name">Name</label>
                         <input id="reg-name" 
                         v-model="form.name" 
                         class="form-input"
                         :class="{'form-input--error': touched.name && errors.name}"
                         type="text"
                         placeholder="Jane Doe"
                         autocomplete="name"
                         @blur="touch('name')" />
                         <p v-if="touched.name && errors.name" class="form-error" >
                            {{ errors.name }}
                         </p>
                     </div>

                     <div class="form-group">
                    <label class="form-label" for="reg-email">Email</label>
            <input
              id="reg-email"
              v-model="form.email"
              class="form-input"
              :class="{ 'form-input--error': touched.email && errors.email }"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              @blur="touch('email')"
            />
            <p v-if="touched.email && errors.email" class="form-error">
              {{ errors.email }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-password">Password</label>
            <input
              id="reg-password"
              v-model="form.password"
              class="form-input"
              :class="{ 'form-input--error': touched.password && errors.password }"
              type="password"
              placeholder="At least 8 characters"
              autocomplete="new-password"
              @blur="touch('password')"
            />
            <p v-if="touched.password && errors.password" class="form-error">
              {{ errors.password }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              v-model="form.confirmPassword"
              class="form-input"
              :class="{ 'form-input--error': touched.confirmPassword && errors.confirmPassword }"
              type="password"
              placeholder="Re-enter your password"
              autocomplete="new-password"
              @blur="touch('confirmPassword')"
            />
            <p v-if="touched.confirmPassword && errors.confirmPassword" class="form-error">
              {{ errors.confirmPassword }}
            </p>
          </div>
                 </form>
            </div>

            <div class="auth-card__footer">
                <button class="btn-primary"
                type="button" :disabled="isSubmitting" @click="handleSubmit" >
                {{ isSubmitting ? 'Creating account...' : 'Create account' }}
            </button>
            <p class="auth-switch" >
                 Already have an account?
                 <router-link to="/login" class="auth-link">
                    Sign in
                 </router-link>
            </p>
            </div>
        </div>
    </div>
</template>
