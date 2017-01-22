<template>
  <div class="pages">
    <router-view keep-alive></router-view>
  </div>
</template>

<script>
</script>

<style>
  html {
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
  }

  textarea {
    -webkit-appearance: none;
  }

  input, textarea {
    -webkit-user-select: auto !important;
    -khtml-user-select: auto !important;
    -o-user-select: auto !important;
  }

  header .title {
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  .button-orange {
    border-color: #fa0;
    color: #fa0;
  }

  .button-orange:active {
    background-color: #fff7ee;
    border-color: #fa0;
    color: #f90;
  }

  .button-fill.button-orange {
    color: #fff;
    background-color: #f90;
  }

  .button-fill.button-orange:active {
    background-color: #fa0;
  }

  .button, .button.button-fill {
    height: 40px;
    line-height: 40px;
  }

  .bar a.icon.icon-cross {
    color: #333;
  }

  .right-menu {
    float: right;
    line-height: 2.2rem;
    height: 2.2rem;
    color: #333;
    position: relative;
  }

  html {
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #333;
  }

  ul {
    list-style: none
  }

  .list-block {
    margin: 10px 0px;
    width: 100%;
  }

  .bar-nav {
    background: #fff
  }

  .submit-panel {
    margin: 10px 10px;
  }

  .items-list ul {
    margin: 0;
    padding: 0px;
  }

  .items-list li {
    border-bottom: 1px solid #ddd;
    padding: 10px 10px;
    display: flex;
    align-items: center;
  }

  .search-shop-tip {
    color: #999;
    height: 30px;
    line-height: 30px;
  }

  .bar a.icon.icon-cross {
    color: #333;
  }

  .user-header-img {
    border-radius: 21px;
    width: 42px;
    height: 42px;
  }

  .default-header {
    background: #48dc6c;
    width: 42px;
    height: 42px;
    border-radius: 21px;
    text-align: center;
    margin: 0 auto;
  }

  .default-header .user-icon {
    background: url("../../common/assets/imgs/userface.png") no-repeat;
    width: 16px;
    height: 24px;
    background-size: 100%;
    display: inline-block;
    margin-top: 10px;
  }

  .pages {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f4f4f4;
  }

  .page {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f4f4f4;
    display: block;
  }

  .container {
    position: relative;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: #fbf9fe;
  }

  .inner-scroll {

  }

  .v-transition {
    -webkit-transition: .4s;
    transition: .4s;
    z-index: 1000
  }

  .v-enter, .v-leave {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  .show-transition {
    -webkit-transition: opacity .8s;
    transition: opacity .8s;
    z-index: 1000
  }

  .show-enter, .show-leave {
    opacity: 0;
  }

  .left-transition {
    z-index: 1000
  }

  .right-transition {
    z-index: 1001
  }

  .right-enter {
    -webkit-animation: pageFromRightToCenter 400ms forwards;
    animation: pageFromRightToCenter 400ms forwards;
    backface-visibility: hidden;
  }

  .right-leave {
    -webkit-animation: pageFromCenterToRight 400ms forwards;
    animation: pageFromCenterToRight 400ms forwards;
    backface-visibility: hidden;
  }

  @-webkit-keyframes pageFromRightToCenter {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
    }
  }

  @keyframes pageFromRightToCenter {
    from {
      transform: translate3d(100%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes pageFromCenterToRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
    }
  }

  @keyframes pageFromCenterToRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100%, 0, 0);
    }
  }

  .left-leave {
    -webkit-animation: pageFromCenterToLeft 400ms forwards;
    animation: pageFromCenterToLeft 400ms forwards;
    backface-visibility: hidden;
  }

  .left-enter {
    -webkit-animation: pageFromLeftToCenter 400ms forwards;
    animation: pageFromLeftToCenter 400ms forwards;
    backface-visibility: hidden;
  }

  @-webkit-keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.9;
      -webkit-transform: translate3d(-20%, 0, 0);
    }
  }

  @keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.9;
      transform: translate3d(-20%, 0, 0);
    }
  }

  @-webkit-keyframes pageFromLeftToCenter {
    from {
      opacity: 0.9;
      -webkit-transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
    }
  }

  @keyframes pageFromLeftToCenter {
    from {
      opacity: 0.9;
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .bar .icon.icon-cross {
    padding: 0.5rem 0.5rem;
  }

  .bar .icon-back {
    font-size: 1.3rem;
    color: #f90;
    width: 2rem;
    height: 2.2rem;
    line-height: 2.2rem;
    text-align: center;
    display: inline-block;
    position: absolute;
    left: 0px;
  }

</style>
