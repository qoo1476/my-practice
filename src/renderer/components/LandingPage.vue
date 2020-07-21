<template>
    <v-app dark>
        <v-system-bar dark color="indigo darken-2" style="-webkit-app-region: drag">
            🐜
            <span>DEWITH-Crawler</span>
            <span>{{version}}</span>
            <v-spacer></v-spacer>
            <v-icon>mdi-clock</v-icon>
            <span v-text="time"></span>
            <v-divider class="mx-2" vertical/>
            <v-btn small text :ripple="false" depressed @click="minimize" style="-webkit-app-region: no-drag;">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-divider class="mx-2" vertical/>
            <v-btn small text :ripple="false" depressed @click="close" style="-webkit-app-region: no-drag;">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-system-bar>
        <!--<v-app-bar app color="green accent-4" dark>
            <v-spacer></v-spacer>
            네이버 크롤링 테스트
        </v-app-bar>-->
        <v-main style="background:#333;">
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
            <div class="text-center">
                <v-bottom-sheet v-model="bottomSheet.show" persistent>
                    <v-sheet class="text-center" height="200px">
                        <div class="py-3">{{bottomSheet.message}}</div>
                        <v-progress-linear
                                v-if="bottomSheet.progress"
                                indeterminate
                                color="indigo darken-2"
                        ></v-progress-linear>
                        <v-btn
                                v-if="bottomSheet.restartShow"
                                class="mt-6"
                                text
                                color="primary"
                                @click="restart"
                        >재시작
                        </v-btn>
                        <v-btn
                                class="mt-6"
                                text
                                color="error"
                                @click="bottomSheet.show = !bottomSheet.show"
                        >닫기
                        </v-btn>
                    </v-sheet>
                </v-bottom-sheet>
            </div>
        </v-main>
    </v-app>
</template>

<script>
    import Lists from "./Lists";

    export default {
        name: 'landing-page',
        components: {Lists},
        data: () => ({
            version: '',
            loading: false,
            naverId: '',
            naverPw: '',
            items: [{title: 'test', subtitle: 'test'}],
            showList: false,
            time: '',
            week: ['일', '월', '화', '수', '목', '금', '토'],
            bottomSheet: {
                show: false,
                message: '',
                restartShow: false,
                progress: false,
            },
        }),
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            minimize() {
                this.$electron.remote.getCurrentWindow().minimize();
            },
            close() {
                this.$electron.remote.getCurrentWindow().close();
            },
            async sendEmail() {
                if (!this.naverId || !this.naverPw) {
                    alert('네이버 아이디, 비밀번호를 입력해주세요.');
                } else {
                    this.loading = true;
                    this.$electron.ipcRenderer.send('crawlEmail', {id: this.naverId, pw: this.naverPw});
                }
            },
            clock() {
                const date = new Date();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                // 초까지 받아온후
                this.time = `${date.getMonth() + 1}월 ${date.getDate()}일 ${this.week[date.getDay()]}요일` +
                    `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
            },
            restart() {
                this.$electron.ipcRenderer.send('restart_app');
            }
        },
        created() {
            this.clock();
            setInterval(this.clock, 1000);

            this.$electron.ipcRenderer.send('app_version');
            this.$electron.ipcRenderer.on('app_version', (event, args) => {
                this.$electron.ipcRenderer.removeAllListeners('app_version');
                this.version = args.version;
            });

            this.$electron.ipcRenderer.on('update_available', () => {
                this.$electron.ipcRenderer.removeAllListeners('update_available');
                this.bottomSheet.message = '업데이트 파일을 다운로드 중입니다...창을 닫아도 업데이트는 진행됩니다.';
                this.bottomSheet.show = true;
                this.bottomSheet.restartShow = false;
                this.bottomSheet.progress = true;
            });

            this.$electron.ipcRenderer.on('update_downloaded', () => {
                this.$electron.ipcRenderer.removeAllListeners('update_downloaded');
                this.bottomSheet.message = '업데이트 파일 다운로드가 완료되었습니다. 재시작을 하면 업데이트가 설치됩니다. 재시작 하시겠습니까?';
                this.bottomSheet.show = true;
                this.bottomSheet.restartShow = true;
                this.bottomSheet.progress = false;
            });


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
