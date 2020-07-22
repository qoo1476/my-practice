<template>
    <div>
        <div class="headline py-8 font-weight-bold white">
            <div class="pl-6">네이버</div>
        </div>
        <v-divider />
        <v-tabs class="pl-6 white pt-4">
            <v-tab>
                예약 크롤링
            </v-tab>
            <v-tab>
                대기중 예약
            </v-tab>
            <v-tab>
                처리된 예약
            </v-tab>
        </v-tabs>
        <v-container fluid class="px-6 pt-8">
            <naver-login></naver-login>
        </v-container>
    </div>
</template>

<script>
    import NaverLogin from "./NaverLogin";
    export default {
        name: 'NaverMain',
        components: {NaverLogin},
    }
</script>

<style scoped>

</style>