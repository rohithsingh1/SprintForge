<template>
    <section class="github-users-page">
        <main class="pageShell">

            <!-- Header -->
            <div class="pageHeader">
                <p class="eyebrow">GitHub directory</p>
                <h1>GitHub Users List</h1>
                <p class="subtitle">Search 100M+ developers on GitHub</p>
            </div>

            <!-- Search -->
            <div class="searchContainer">
                <span class="searchIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    type="search"
                    placeholder="Search by username…"
                    v-model="searchUserInput"
                    class="searchInput"
                    autocomplete="off"
                    spellcheck="false"
                    aria-label="Search GitHub users"
                />
                <span v-if="loading" class="spinnerInline"></span>
            </div>

            <!-- Initial state — nothing typed yet -->
            <template v-if="searchTerm.length === 0">
                <div class="emptyState">
                    <div class="emptyIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <p class="emptyTitle">Start by searching a username</p>
                    <p class="emptyHint">Try <strong>torvalds</strong>, <strong>gaearon</strong>, or <strong>yyx990803</strong></p>
                </div>
            </template>

            <!-- Skeleton loading -->
            <template v-else-if="loading">
                <div class="usersList">
                    <div v-for="n in 9" :key="n" class="userCard skeleton">
                        <div class="skeletonAvatar"></div>
                        <div class="skeletonInfo">
                            <div class="skeletonLine wide"></div>
                            <div class="skeletonLine narrow"></div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Error state -->
            <template v-else-if="isError">
                <div class="stateBox errorBox">
                    <div class="stateIcon errorIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <p class="stateTitle">Something went wrong</p>
                    <p class="stateHint">GitHub API may be rate-limiting. Wait a moment and try again.</p>
                    <button class="retryBtn" @click="retry">Try Again</button>
                </div>
            </template>

            <!-- Results grid -->
            <template v-else-if="usersList.length > 0">
                <p class="resultsCount">
                Showing {{ usersList.length }} of {{ totalCount.toLocaleString() }} results for <strong>"{{ searchTerm }}"</strong>
                </p>
                <div class="usersList">
                    <div v-for="user in usersList" :key="user.id" class="userCard">
                        <img :src="user.avatar_url" :alt="`${user.login} avatar`" loading="lazy" />
                        <div class="userInfo">
                            <h2>{{ user.login }}</h2>
                            <a :href="user.html_url" target="_blank" rel="noopener noreferrer">
                                View Profile
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </template>

            <!-- No results -->
            <template v-else-if="!isSearching && usersList.length === 0">
                <div class="stateBox">
                    <div class="stateIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                    </div>
                    <p class="stateTitle">No users found</p>
                    <p class="stateHint">No results for <strong>"{{ searchTerm }}"</strong>. Check the spelling or try a different username.</p>
                </div>
            </template>

        </main>
    </section>
</template>

<script>
import debouncedFunction from './debounceCustomHook'

export default {
    name: 'GithubDebouncedSearchUsers',
    data() {
        return {
            searchUserInput: '',
            usersList: [],
            isError: false,
            loading: false,
            isSearching: false,
            totalCount:0
        }
    },
    methods: {
        async fetchUsers(searchVal) {
            try {
                this.isSearching = false
                this.isError = false
                this.loading = true
                this.controller?.abort()   
                this.controller = new AbortController()
                const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(searchVal)}&per_page=30`, {
                    signal: this.controller.signal
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const resData = await res.json()
                this.usersList = resData?.items ?? []
                this.totalCount = resData?.total_count ?? 0
            } catch (error) {
                if (error.name === 'AbortError') return
                this.isError = true
                this.usersList = []
            } finally {
                this.loading = false
            }
        },
        retry() {
            const trimmed = this.searchTerm
            if (trimmed) this.fetchUsers(trimmed)
        }
    },
    created() {
        this.debouncedFetchUsers = debouncedFunction(this.fetchUsers, 1000)
    },
    beforeDestroy() {
        this.controller?.abort()
    },
    watch: {
        searchUserInput(newVal) {
            const trimmed = newVal.trim()
            if (trimmed.length > 0) {
                this.isSearching = true   
                this.debouncedFetchUsers(trimmed)
            } else {
                this.isSearching = false
                this.usersList = []
                this.isError = false
                this.controller?.abort()             // ← add this
                this.loading = false                 // ← and this
            }
        }
    },
    computed: {
        searchTerm() {
            return this.searchUserInput.trim()
        }
    }
}
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────── */
.github-users-page {
    background: linear-gradient(145deg, #f0faf5 0%, #e8f4f0 50%, #f5f0fa 100%);
    min-height: 100vh;
    padding: 56px 20px;
    width: 100%;
}

/* ── Shell ───────────────────────────────────────────────── */
.pageShell {
    background: #ffffff;
    border: 1px solid #e2ece7;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 24px 60px rgba(29, 78, 56, 0.08);
    margin: 0 auto;
    max-width: 1080px;
    padding: 48px 40px 52px;
    width: 100%;
}

/* ── Header ──────────────────────────────────────────────── */
.pageHeader {
    margin-bottom: 36px;
    text-align: center;
}

.eyebrow {
    color: #40b883;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

h1 {
    color: #111827;
    font-size: 38px;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 10px;
}

.subtitle {
    color: #6b7280;
    font-size: 15px;
}

/* ── Search ──────────────────────────────────────────────── */
.searchContainer {
    align-items: center;
    display: flex;
    margin: 0 auto 36px;
    max-width: 520px;
    position: relative;
}

.searchIcon {
    color: #9ca3af;
    left: 16px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.searchInput {
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    color: #111827;
    font-size: 15px;
    height: 52px;
    outline: none;
    padding: 0 44px 0 48px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    width: 100%;
}

.searchInput::placeholder {
    color: #9ca3af;
}

.searchInput:focus {
    background: #fff;
    border-color: #40b883;
    box-shadow: 0 0 0 4px rgba(64, 184, 131, 0.12);
}

/* hide browser's native X in search inputs */
.searchInput::-webkit-search-cancel-button { display: none; }

/* ── Inline spinner ──────────────────────────────────────── */
.spinnerInline {
    animation: spin 0.75s linear infinite;
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #40b883;
    flex-shrink: 0;
    height: 18px;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
}

@keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
}

/* ── Empty / initial state ───────────────────────────────── */
.emptyState {
    padding: 48px 20px 32px;
    text-align: center;
}

.emptyIcon {
    color: #d1d5db;
    margin-bottom: 20px;
}

.emptyTitle {
    color: #374151;
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 8px;
}

.emptyHint {
    color: #9ca3af;
    font-size: 14px;
}

.emptyHint strong {
    color: #6b7280;
}

/* ── Results count ───────────────────────────────────────── */
.resultsCount {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 18px;
}

.resultsCount strong {
    color: #374151;
}

/* ── State boxes (error / no results) ───────────────────── */
.stateBox {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 40px 24px;
    text-align: center;
}

.errorBox {
    background: #fff8f8;
    border-color: #fecaca;
}

.stateIcon {
    color: #d1d5db;
    margin-bottom: 16px;
}

.errorIcon {
    color: #f87171;
}

.stateTitle {
    color: #111827;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 8px;
}

.stateHint {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 20px;
}

.stateHint strong {
    color: #374151;
}

.retryBtn {
    background: #40b883;
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 22px;
    transition: background 0.2s;
}

.retryBtn:hover {
    background: #2f9d6d;
}

/* ── Grid ────────────────────────────────────────────────── */
.usersList {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

/* ── User card ───────────────────────────────────────────── */
.userCard {
    align-items: center;
    background: #fff;
    border: 1px solid #e8f0ec;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    display: flex;
    gap: 14px;
    padding: 16px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.userCard:hover {
    border-color: #40b883;
    box-shadow: 0 8px 24px rgba(64, 184, 131, 0.12);
    transform: translateY(-2px);
}

.userCard img {
    border-radius: 50%;
    flex-shrink: 0;
    height: 56px;
    object-fit: cover;
    outline: 3px solid #eef7f2;
    outline-offset: 2px;
    width: 56px;
}

.userInfo {
    min-width: 0;
}

.userInfo h2 {
    color: #111827;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.userInfo a {
    align-items: center;
    background: #f0faf5;
    border: 1px solid #c3e6d5;
    border-radius: 6px;
    color: #2f9d6d;
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    gap: 4px;
    padding: 6px 11px;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
}

.userInfo a:hover {
    background: #40b883;
    border-color: #40b883;
    color: #fff;
}

/* ── Skeleton ────────────────────────────────────────────── */
.skeleton {
    pointer-events: none;
}

.skeletonAvatar {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 50%;
    flex-shrink: 0;
    height: 56px;
    width: 56px;
}

.skeletonInfo {
    flex: 1;
    min-width: 0;
}

.skeletonLine {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
    height: 13px;
    margin-bottom: 10px;
}

.skeletonLine.wide  { width: 70%; }
.skeletonLine.narrow { width: 45%; margin-bottom: 0; }

@keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 640px) {
    .github-users-page { padding: 24px 12px; }

    .pageShell { padding: 28px 20px 36px; }

    h1 { font-size: 26px; }

    .usersList { grid-template-columns: 1fr; }
}
</style>
