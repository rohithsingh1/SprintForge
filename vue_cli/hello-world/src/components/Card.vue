<template>
    <div class="card">
        <h2>Card Title</h2>
        <slot>
            <p>No content provided.</p>
        </slot> <!-- 🕳️ hole — parent fills this -->
    </div>
</template>

<script>
export default {
    name: 'CardComponent'
}
</script>