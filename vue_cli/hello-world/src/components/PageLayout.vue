<template>
    <div>
        <header>
            <slot name="header"></slot>
        </header>
        <main>
            <slot></slot>
        </main>
        <footer>
            <slot name="footer"></slot> <!-- hole 3 -->
        </footer>
    </div>
</template>

<script>
export default {
    name: 'PageLayout'
}

</script>