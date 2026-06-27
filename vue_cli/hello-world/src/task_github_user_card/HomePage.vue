<template>
    <section class="github-users-page">
        <main class="pageShell">
            <div class="pageHeader">
                <p class="eyebrow">GitHub directory</p>
                <h1>GitHub Users List</h1>
            </div>

            <template v-if="loading">
                <div class="loading">Loading.....</div>
            </template>
            <template v-else-if="isError">
                <div class="error">
                    <p>Some thing went wrong</p>
                    <button @click="fetchUsers">Try Again</button>
                </div>
            </template>
            <template v-else>
                <div class="usersList">
                    <div v-for="user in usersList" :key="user.id" class="userCard">
                        <img :src="user.avatar_url" :alt="`${user.login} avatar`" loading="lazy" />
                        <div class="userInfo">
                            <h2>{{ user.login }}</h2>
                            <a :href="user.html_url" target="_blank" rel="noopener noreferrer">
                                View {{ user.login }}'s profile
                            </a>
                        </div>
                    </div>
                </div>
            </template>
        </main>
    </section>
</template>

<script>
export default {
    name:'GithubUsersList',
    data: function () {
        return {
            usersList: [],
            isError: false,
            loading: false,
            controller: null
        }
    },
    methods: {
        fetchUsers: async function () {
            try {
                this.loading = true
                this.controller = new AbortController()
                const res=await fetch('https://api.github.com/users',{ signal: this.controller.signal })
                // If API returns 403, 500, etc — no throw, so catch never fires
                // // Fix:
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const resData = await res.json()
                this.loading = false
                this.usersList = resData   
            } catch (error) {
                this.loading=false
                this.isError=true
                this.usersList = []
            } finally {
                this.loading=false
            }
        }
    },
    created: function () {
        this.fetchUsers()
    },
    beforeDestroy: function () {
        this.controller?.abort()
    }
}
</script>

<style scoped>
.github-users-page {
    min-height: 100vh;
    padding: 48px 20px;
    width: 100%;
}

.pageShell {
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid #dbeae2;
    border-radius: 8px;
    box-shadow: 0 24px 70px rgba(29, 78, 56, 0.1);
    margin: 0 auto;
    max-width: 1080px;
    padding: 36px;
    width: 100%;
}

.pageHeader {
    margin-bottom: 28px;
    text-align: center;
}

.eyebrow {
    color: #40b883;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0;
    margin-bottom: 8px;
    text-transform: uppercase;
}

h1 {
    color: #1f2937;
    font-size: 36px;
    line-height: 1.2;
}

.loading,
.error {
    background: #ffffff;
    border: 1px solid #d9e2dc;
    border-radius: 8px;
    color: #374151;
    font-weight: 600;
    padding: 24px;
}

.error p {
    margin-bottom: 16px;
}

.usersList {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.userCard {
    align-items: center;
    background: #ffffff;
    border: 1px solid #dce7e0;
    border-radius: 8px;
    box-shadow: 0 10px 24px rgba(31, 41, 55, 0.08);
    display: flex;
    gap: 16px;
    min-height: 112px;
    padding: 18px;
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.userCard:hover {
    border-color: #40b883;
    box-shadow: 0 14px 30px rgba(31, 41, 55, 0.12);
    transform: translateY(-2px);
}

.userCard img {
    border-radius: 50%;
    flex: 0 0 64px;
    height: 64px;
    object-fit: cover;
    outline: 4px solid #eef7f2;
    width: 64px;
}

.userInfo {
    min-width: 0;
}

.userInfo h2 {
    color: #111827;
    font-size: 18px;
    line-height: 1.25;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.userInfo a,
button {
    background: #40b883;
    border: 0;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    display: inline-flex;
    font-size: 14px;
    font-weight: 700;
    justify-content: center;
    line-height: 1;
    padding: 11px 14px;
    text-decoration: none;
}

.userInfo a:hover,
button:hover {
    background: #2f9d6d;
}

@media (max-width: 560px) {
    .github-users-page {
        padding: 20px 12px;
    }

    .pageShell {
        padding: 22px;
    }

    h1 {
        font-size: 26px;
    }

    .usersList {
        grid-template-columns: 1fr;
    }
}
</style>
