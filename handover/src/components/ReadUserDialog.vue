<template>
    <div class="dialogs" v-bind:class="{ 'active': showModal}">
        <div class="dialog" v-bind:class="{ 'dialog-active': showModal}">
            <div class="dialog-content">
                <slot name="header"></slot>
                <slot name="body" class="dialog-body"></slot>
            </div>
        </div>
        <div class="dialog-overlay" @click="close"></div>
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {};
        },
        props: ['showModal'],
        ready: function () {

        },
        methods: {
            close: function () {
                this.showModal = false
            }
        }
    };
</script>
<style>
    .dialogs {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
    }

    .dialogs.active {
        z-index: 2000;
    }
    .dialog {
        width: 300px;
        position: fixed;
        left: 50%;
        top: 20%;
        transform: translateX(-50%);
        z-index: -1;
        visibility: hidden;
        backface-visibility: hidden;
        perspective: 1300px;
        height: 60%;
    }

    .dialog-active {
        visibility: visible;
        z-index: 2000;
    }

    .dialog-active .dialog-content {
        position: relative;
        opacity: 1;
    }

    .dialog-active ~ .dialog-overlay {
        opacity: 1;
        visibility: visible;
    }

    .dialog-content {
        border-radius: 3px;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        transition: .5s ease-in-out;
        opacity: 0;
        transform-style: preserve-3d;
        position: relative;
        height: 100%;
    }

    .dialog-header {
        background: #cb4a70;
        color: #fff;
    }

    .dialog-title {
        margin: 0;
        font-size: 2em;
        text-align: center;
        font-weight: 200;
        line-height: 2em;
    }

    .dialog-body {
        padding: 7px 10px;
        max-height: 300px;
        max-height: calc(100% - 40px);
        overflow-y: auto;
    }

    .dialog-overlay {
        content: "";
        position: fixed;
        visibility: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        opacity: 0;
        background: rgba(0, 0, 0, 0.5);
        transition: all .6s;

    }
</style>