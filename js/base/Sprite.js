import { DataStore } from "./DataStore.js";
/**
 * 所有图片的父类,包含所有图片公有的属性和方法
 * @param {Object} img 图片对象
 * @param {Number} srcX 图片资源的起点x
 * @param {Number} srcY 图片资源的起点y
 * @param {Number} srcW 图片资源的宽度
 * @param {Number} srcH 图片资源的高度
 * @param {Number} x 图片在画布上的起点x
 * @param {Number} y 图片在画布上的起点y
 * @param {Number} width 图片在画布上的宽度
 * @param {Number} height 图片在画布上的高度
 */
export class Sprite{
    constructor(img=null,srcX=0,srcY=0,srcW=0,srcH=0,x=0,y=0,width=0,height=0){
        this.ctx = DataStore.getInstance().ctx;
        this.img = img;
        this.srcX = srcX;
        this.srcY = srcY;
        this.srcW = srcW;
        this.srcH = srcH;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;     
    }
    // 画图的方法
    draw(img=this.img,
        srcX=this.srcX,srcY=this.srcY,
        srcW=this.srcW,srcH=this.srcH,
        x=this.x,y=this.y,
        width=this.width,height=this.height){
            this.ctx.drawImage(img,srcX,srcY,srcW,srcH,x,y,width,height);
    }
    // 获取图片的方法
    static getImage(key){
        return DataStore.getInstance().imgs.get(key);
    }
}