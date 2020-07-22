<template>
    <div style="max-height: 500px;overflow-y: auto;">
        <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click=""
        >
            <v-list-item-avatar>
                <v-icon class="blue white--text">N</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
                <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
            </v-list-item-action>
        </v-list-item>
    </div>
</template>

<script>
    export default {
        name: 'lists',
        props: {
            items: Array
        }
    }
</script>

<style scoped>

</style>