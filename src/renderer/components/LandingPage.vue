<template>
    <v-row>
        <v-col cols="12">
            <v-card class="mx-10 mt-12" elevation="12" v-if="!showList">
                <v-card-title>네이버 로그인 테스트</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="네이버아이디" solo-inverted hide-details v-model="naverId"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="네이버비밀번호" type="password" solo-inverted hide-details
                                          v-model="naverPw"/>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn :ripple="false" x-large color="indigo" dark block @click="sendEmail"
                           :loading="loading">
                        테스트 크롤링 실행
                    </v-btn>
                </v-card-actions>
            </v-card>
            <lists :items="items" v-if="showList"/>
        </v-col>
    </v-row>
</template>

<script>
    import Lists from "./Lists";

    export default {
        name: 'landing-page',
        components: {Lists},
        data: () => ({
            loading: false,
            naverId: '',
            naverPw: '',
            items: [{title: 'test', subtitle: 'test'}],
            showList: false,
        }),
        methods: {
            async sendEmail() {
                if (!this.naverId || !this.naverPw) {
                    alert('네이버 아이디, 비밀번호를 입력해주세요.');
                } else {
                    this.loading = true;
                    this.$electron.ipcRenderer.send('crawlEmail', {id: this.naverId, pw: this.naverPw});
                }
            },
        },
        created() {
            this.$electron.ipcRenderer.on('crawlEmailEnd', (event, {isLoggedIn, result}) => {
                if (isLoggedIn) {
                    this.items = result;
                    this.showList = true;
                    new Notification('🙊🙊성공🙊🙊', {
                        body: '🙆크롤링 테스트에 성공하였습니다🙆',
                    });
                } else {
                    alert('네이버 아이디나 비밀번호가 잘못되었습니다.');
                }
                this.loading = false;
            });
        }
    }
</script>

<style>
</style>
