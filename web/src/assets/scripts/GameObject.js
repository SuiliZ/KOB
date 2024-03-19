// 创建游戏基类
const GAME_OBJECTS = [];

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.timedelta = 0; //这帧执行的时刻距离上一帧执行时刻的间隔
        this.has_called_start = false;
    }

    start() { // 只执行一次，创建的时候执行，只有第一帧执行start()，后面的每一帧都执行update()
    }

    update() { // 每一帧执行一次，除了第一帧之外

    }

    on_destroy() { // 删除之前执行

    }

    destroy() { // 删除对象，把当前对象从GAME_OBJECTS数组中去掉
        this.on_destroy();
        for(let i in GAME_OBJECTS) {
            const obj = GAME_OBJECTS[i];
            if(obj === this) {
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp; // 上一次执行的时刻

const step = timestamp => {
    for(let obj of GAME_OBJECTS) { // for...of...遍历的是值，for...in...遍历的是下标
        if(!obj.has_called_start) { // 每个对象在第一帧的时候调用start()函数
            obj.has_called_start = true;
            obj.start();
        } else { // 第一帧调用后的每一帧，都执行update()函数
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step); // step()执行完后又调用requestAnimationFrame()函数
}

// requestAnimationFrame()表示在下一帧的时候执行step()函数
requestAnimationFrame(step)