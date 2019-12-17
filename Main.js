import { ResourceLoader } from "./js/base/ResourceLoader.js";
import { DataStore } from "./js/base/DataStore.js";
import { Background } from "./js/runtime/Background.js";
import { Director } from "./js/Director.js";
import { Land } from "./js/runtime/Land.js";
import { Birds } from "./js/player/Birds.js";
import { Score } from "./js/player/Score.js";
import { StartButton } from "./js/player/StartButton.js";
import { WxAPI } from "./WxAPI.js";


export class Main{
    constructor(){
        console.log('Main执行了');
        // 获取canvas
        // this.canvas = document.getElementById('game');
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        // 初始化资源加载器
        this.loader = new ResourceLoader();
        // 获取变量池
        this.dataStore = DataStore.getInstance();
        // 获取导演
        this.director = Director.getInstance();
        // console.log(this.loader);
        // let bg = this.loader.map.get("background");
        // bg.onload =()=>{
        //     this.ctx.drawImage(bg,0,0,bg.width,bg.height,0,0,375,667);
        // }
        this.loader.onLoaded(map=>this.onResourcesLoaded(map));
            
    }
    // 定义资源加载成功以后调用的方法
    onResourcesLoaded(map){
        // console.log(map);
        // 将资源保存进变量池中
        // 不使用put保存的原因是:put保存的数据会定期销毁,而使用属性的方式保存数据,是长期存在的,不会定期销毁
        this.dataStore.imgs = map;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        const api = new WxAPI();
        // api.playMusic();
        // api.getSysInfo();
        // api.sendHttp();
        // api.socket();
        // api.downLoad();
        wx.getUserInfo({
          success:res=>{
            this.init();
          },
          fail:err=>{
            api.getUserInfo(()=>{
              this.init();    
            });
          }
        })

    }

    // 初始化游戏数据
    init(){
        this.director.isGameOver = false;
        this.dataStore
            .put('background',new Background()) // 初始化背景图
            .put('land',new Land())
            .put('pipes',[])
            .put('birds',new Birds())
            .put('score',new Score())
            .put('startButton',new StartButton())
        this.addClick();
        this.director.createPipes();
        this.director.run();
    }

    addClick(){
        // this.canvas.addEventListener('touchstart',e=>{
          wx.onTouchStart(e=>{
            // 点击事件有两个效果
            // 1.游戏结束,点击重新开始
            // 2.游戏进行中,点击小鸟向上一段距离
            if(this.director.isGameOver){
                // 游戏结束
                this.init();

            }else{
                // 游戏进行中,小鸟上飞一段距离
                this.director.BirdsEvent()
            }
        });
    }
}