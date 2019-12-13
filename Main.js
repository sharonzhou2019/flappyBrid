import { ResourceLoader } from "./js/base/ResourceLoader.js";
import { DataStore } from "./js/base/DataStore.js";

export class Main{
    constructor(){
        console.log('Main执行了');
        // 获取canvas
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        // 初始化资源加载器
        this.loader = new ResourceLoader();
        // 获取变量池
        this.dataStore = DataStore.getInstance();
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
        this.dataStore.map = map;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
    }
}