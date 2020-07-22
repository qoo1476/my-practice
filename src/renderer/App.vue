<template>
    <v-app dark id="app">
        <v-system-bar color="blue-grey darken-1" dark style="-webkit-app-region: drag" app>
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
        <v-navigation-drawer
                class="indigo darken-3"
                dark
                app
                permanent
        >
            <div class="headline py-8 text-center white--text" style="border-bottom:thin solid #9e9e9e5c;">DEWITH 예약연결</div>
            <v-list>
                <v-list-item link to="/naver">
                    <v-list-item-icon>
                        <v-img src="static/images/naver_logo.jpg" width="10px"/>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>네이버</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link to="/kakao">
                    <v-list-item-icon>
                        <v-img src="static/images/daum_logo.png" width="10px"/>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>다음 카카오</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <template v-slot:append>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-cog</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>설정</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-navigation-drawer>
        <v-main class="blue-grey lighten-4">
            <router-view></router-view>
        </v-main>
        <v-bottom-sheet v-model="bottomSheet.show" persistent class="text-center">
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
    </v-app>
</template>

<script>
    export default {
        name: 'dewith',
        data: () => ({
            version: '',
            time: '',
            week: ['일', '월', '화', '수', '목', '금', '토'],
            bottomSheet: {
                show: false,
                message: '',
                restartShow: false,
                progress: false,
            },
            bottomNav: 3,
        }),
        computed: {
            color() {
                switch (this.bottomNav) {
                    case 0:
                        return 'blue-grey'
                    case 1:
                        return 'teal'
                    case 2:
                        return 'brown'
                    case 3:
                        return 'indigo'
                }
            },
        },
        methods: {
            minimize() {
                this.$electron.remote.getCurrentWindow().minimize();
            },
            close() {
                this.$electron.remote.getCurrentWindow().close();
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
        }
    }
</script>

<style>
    /* CSS */
</style>
