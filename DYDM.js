(function() {
    'use strict';
    var FONT_SIZE = 40	//字体的大小
    var DANMU_PADDING = 10 //弹幕的宽度
    var SPEED = 400 //弹幕速度
    var MIN_TIME = 4000 //同一行的弹幕最小间隔时间，如果弹幕有重叠就增加这个值
    var BEGIN_TOP = 10 //弹幕离最上方的距离
    var start = setInterval(function(){
        if (document.querySelector("#__h5player").children[3].children[1]){
            initApplication()
            clearInterval(start)
        }
    },500)
    function initApplication(){
        var startTime = 0
        var prevTop = 0
        var targetNode = document.getElementById('js-player-barrage');
        var config = { attributes: false, childList: true, subtree: true };
        var callback = function(mutationsList) {
            for(var mutation of mutationsList) {
                if(mutation.addedNodes[0]){
                    send(mutation.addedNodes[0].querySelector(".Barrage-content"));
                }
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        //建立一个放弹幕的容器
        var wrapper = document.querySelector("#__h5player").children[3].children[1]
        //使用第一行弹幕的时间来控制弹幕的并发
        function send(danmu) {
            if(!danmu) return;
            var dom = danmu.cloneNode(true)
            var now = new Date()
            var clientWidth = wrapper.clientWidth
            var clientHeight = wrapper.clientHeight
            var time = clientWidth / SPEED
            dom.style.position = 'absolute'
            dom.style.zIndex = '10000'
            dom.style.transition = `transform ${time}s linear`
            dom.style.transform = `translateX(${clientWidth}px)`
            dom.style.fontSize = `${FONT_SIZE}px`
            dom.style.fontWeight = '800'
            if (!danmu.getAttribute('class').includes('color')){
                dom.style.color = '#fff'
                dom.style.textShadow = '#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0'
            }
            var top = BEGIN_TOP
            if (startTime === 0 ) {
                startTime = now
            } else {
                if(now - startTime <= MIN_TIME && prevTop + 2 * FONT_SIZE + DANMU_PADDING < clientHeight) {
                    top=prevTop + FONT_SIZE + DANMU_PADDING
                    prevTop = prevTop + FONT_SIZE + DANMU_PADDING
                } else {
                    top=BEGIN_TOP
                    prevTop = BEGIN_TOP
                    startTime = now
                }
            }
            dom.style.top = `${top}px`
            wrapper.append(dom)
            //弹幕滚动效果
            setTimeout(function(){dom.style.transform = 'translateX(-200px)'},0)
            //垃圾回收
            setTimeout(function(){dom.remove()},time * 1000)
        }
    }
})();
