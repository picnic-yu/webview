<template>
  <div><router-view keep-alive  transition="slide" ></router-view></div>
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
.fade-transition{
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
  display: flex;
  align-items: center;
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
.items-list li{border-bottom: 1px solid #ddd;padding:10px 10px;display: flex;align-items: center;}
.search-shop-tip{
  color: #999;
  height:30px;
  line-height: 30px;
}
.bar a.icon.icon-cross{
  color: #333;
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
