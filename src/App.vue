<template>
    <v-app>

        <v-toolbar>
            <v-toolbar-title v-text="title"></v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container fluid>
                <v-slide-y-transition mode="out-in">
                    <v-layout column align-center>
                        <div id="epigen" style="margin: 20px"></div>

                    </v-layout>
                </v-slide-y-transition>
            </v-container>
        </main>

        <v-footer :fixed="fixed">
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        data () {
            return {
                widgets: false,
                value1: 12,
                clipped: false,
                drawer: true,
                fixed: false,
                items: [
                    {icon: 'bubble_chart', title: 'Inspire'}
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'epigen.js'
            }
        }
    }
</script>

<style lang="stylus">
    @import './stylus/main'
</style>
