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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 100%;
    color:#333;
  }
  ul{list-style: none;padding:0px;margin:0px;}
  header .title{
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space:nowrap;
  }
  .button-orange{
    border-color:#fa0;
    color: #fa0;
  }
  .button-orange:active{
    background-color: #fff7ee;
    border-color:#fa0;
    color: #f90;
  }
  .button-fill.button-orange{
    color: #fff;
    background-color: #f90;
  }
  .button-fill.button-orange:active{
    background-color: #fa0;
  }
  .button,.button.button-fill{
    height:40px;
    line-height: 40px;
  }
  /*.fade-transition{
    -webkit-transition: opacity .5s ease;
    transition: opacity .5s ease;
  }
  .fade-enter,.fade-leave{
    opacity: 0;
  }
  .slide-transition{
    display: inline-block;
  }
  .page-from-right-to-center,.slide-enter {
    opacity: 0;
    -webkit-animation: pageFromRightToCenter 400ms 100ms forwards;
    animation: pageFromRightToCenter 400ms 100ms forwards;
    z-index: 2002;
  }
  .page-from-center-to-right {
    -webkit-animation: pageFromCenterToRight 400ms forwards;
    animation: pageFromCenterToRight 400ms forwards;
    z-index: 2002;
  }
  @-webkit-keyframes pageFromRightToCenter {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes pageFromRightToCenter {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @-webkit-keyframes pageFromCenterToRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
  }
  @keyframes pageFromCenterToRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
  }
  .page-from-center-to-left,.slide-leave {
    -webkit-animation: pageFromCenterToLeft 400ms forwards;
    animation: pageFromCenterToLeft 400ms forwards;
    z-index: 2002;
  }
  .page-from-left-to-center {
    -webkit-animation: pageFromLeftToCenter 9000ms forwards;
    animation: pageFromLeftToCenter 9000ms forwards;
    z-index: 2002;
  }
  @-webkit-keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
  }
  @keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
  }
  @-webkit-keyframes pageFromLeftToCenter {
    from {
      opacity: .5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes pageFromLeftToCenter {
    from {
      opacity: .5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }*/

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
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .right-leave {
    -webkit-animation: pageFromCenterToRight 400ms forwards;
    animation: pageFromCenterToRight 400ms forwards;
    -webkit-backface-visibility: hidden;
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
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
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
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  .left-leave {
    -webkit-animation: pageFromCenterToLeft 400ms forwards;
    animation: pageFromCenterToLeft 400ms forwards;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .left-enter {
    -webkit-animation: pageFromLeftToCenter 400ms forwards;
    animation: pageFromLeftToCenter 400ms forwards;
    -webkit-backface-visibility: hidden;
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
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.9;
      -webkit-transform: translate3d(-20%, 0, 0);
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
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  .bar a.icon.icon-cross{
    color: #333;
  }
  .right-menu{
    float: right;
    line-height: 2.2rem;
    height:2.2rem;
    color: #333;
    position: relative;
  }
  html {
    height: 100%;
  }
  body {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 100%;
    color:#333;
  }
  ul{list-style: none}
  .list-block{
    margin:10px 0px;
    width: 100%;
  }
  .bar-nav{background: #fff}
  .submit-panel{margin:10px 10px;}
  .items-list ul{margin:0;padding:0px;}
  .items-list li{border-bottom: 1px solid #ddd;padding:10px 10px;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;}
  .search-shop-tip{
    color: #999;
    height:30px;
    line-height: 30px;
  }
  .bar a.icon.icon-cross{
    color: #333;
  }


</style>
