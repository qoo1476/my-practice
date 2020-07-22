<template>
    <v-card tile flat style="padding: 48px 148px;">
        <v-card-title>{{showList ? '최근메일목록(테스트용입니다. 맞는지 확인해보세요.)' : '로그인'}}</v-card-title>
        <v-divider />
        <v-card-text>
            <div v-if="!showList">
                <v-text-field class="py-5" label="네이버아이디" hide-details v-model="naverId" @keyup.enter.native.prevent="sendEmail"/>
                <v-text-field class="py-5" label="네이버비밀번호" type="password" hide-details
                              v-model="naverPw" @keyup.enter.native.prevent="sendEmail"/>
                <div class="mt-12 d-flex justify-center">
                    <v-btn :ripple="false" x-large color="indigo" dark @click="sendEmail"
                           :loading="loading" tile style="padding: 0px 92px;" elevation="0">
                        로그인
                    </v-btn>
                </div>
            </div>
            <lists :items="items" v-if="showList"/>
        </v-card-text>
    </v-card>
</template>

<script>
    import Lists from "../Lists";

    export default {
        name: 'NaverLogin',
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