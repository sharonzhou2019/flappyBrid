import { DataStore } from "./base/DataStore.js";
import { UpPipe } from "./runtime/UpPipe.js";
import { DownPipe } from "./runtime/DownPipe.js";
import { WxAPI } from "../WxAPI.js";
// 导演类,控制游戏的逻辑
export class Director{
    constructor(){
        this.dataStore = DataStore.getInstance();
        this.api = new WxAPI();

    }

    static getInstance(){
        if(!Director.instance){
            Director.instance = new Director();
        }
        return Director.instance;
    }
    // 创建水管组的方法
    createPipes(){
        const minTop = this.dataStore.canvas.height/8;
        const maxTop = this.dataStore.canvas.height/2;
        const top = Math.random()*(maxTop-minTop)+minTop;
        this.dataStore.get('pipes').push(new UpPipe(top));
        this.dataStore.get('pipes').push(new DownPipe(top));  
    }
    // 小鸟事件(点击飞高一点)
    BirdsEvent(){
        for(let i=0;i<3;i++){
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }
        this.dataStore.get('birds').time = 0;
    }

    // 判断小鸟与某个水管的撞击情况
    isStrike(bird,pipe){
        if(bird.right<pipe.left ||
            bird.left>pipe.right ||
            bird.top>pipe.buttom ||
            bird.buttom<pipe.top){
                return false
            }
            return true;
    }

    // 判断游戏结束的情况
    check(){
        const birds = this.dataStore.get('birds');
        const land = this.dataStore.get('land');
        const pipes = this.dataStore.get('pipes');
        const score = this.dataStore.get('score');
        

        // 小鸟撞天撞地的情况
        if(birds.birdsY[0]<0 || birds.birdsY[0]+birds.birdsHeight[0]>land.y){
            this.isGameOver = true;
            return ;
        }
        // 判断小鸟与水管的撞击
        // 构建小鸟的边框模型
        const birdBorder = {
            top: birds.birdsY[0],
            buttom: birds.birdsY[0]+birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0]+birds.birdsWidth[0]
        }
        // 遍历水管,构建水管的模型
        for(let i=0;i<pipes.length;i++){
            const p = pipes[i];
            const pipeBorder = {
                top:p.y,
                buttom: p.y+p.height,
                left: p.x,
                right: p.x+p.width
            }
            // 将每一根水管与小鸟比对,判断有没有撞上
            if(this.isStrike(birdBorder,pipeBorder)){
                this.isGameOver = true;
                return ;
            }
        }
        // 加分:小鸟的坐标大于水管的右边且处于加分的状态
        if(birds.birdsX[0]>pipes[0].x+pipes[0].width && score.canAdd){
          score.canAdd = false;//关闭加分
          score.scoreNum++;

        }

    }

    // 程序运行的方法
    run(){
        this.check();
        if(!this.isGameOver){
            this.dataStore.get('background').draw();
            // 获取水管组
            const pipes = this.dataStore.get('pipes');
            // console.log(pipes);
            // 判断,添加水管
            // 水管超过界面的一半
            if(pipes[0].x<(this.dataStore.canvas.width/2-pipes[0].width) && pipes.length==2){
                this.createPipes();
            }
            // 删除过界的水管
            if(pipes[0].x+pipes[0].width<0 && pipes.length==4){
                pipes.shift();
                pipes.shift();
                //开启加分
                this.dataStore.get('score').canAdd = true;
            }
            // 遍历pipes,并画图
            pipes.forEach(p=>{
                p.draw();
            });

            this.dataStore.get('birds').draw();
            this.dataStore.get('score').draw();
            this.dataStore.get('land').draw();

            this.id = requestAnimationFrame(()=>this.run());

            // cancelAnimationFrame()

        }else{
            // 游戏结束
            // alert('游戏结束'); 
            this.api.boom();
                      
            // 解决安卓手机花屏问题
            this.dataStore.get('background').draw();
            this.dataStore.get('pipes').forEach(p => {
              p.draw()
            });
            this.dataStore.get('birds').draw();
            this.dataStore.get('score').draw();
            this.dataStore.get('land').draw();
            this.dataStore.get('startButton').draw();
            // 清除id
            cancelAnimationFrame(this.id);
            //清除上一局游戏的数据
            this.dataStore.destroy();
            
        }

    }

    
}