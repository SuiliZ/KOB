import { GameObject } from "./GameObject";
import { WallObject } from './WallObject';

export class GameMapObject extends GameObject {
    // ctx画布，和画布的父元素parent
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        // 表示在canvas里要画13×13的地图格子，L表示每个小格子的边长
        this.L = 0; 
        this.rows = 13;
        this.cols = 13;

        this.inner_walls_count = 20;
        this.walls = [];
    }

    // Flood Fill算法，洪水填充问题
    check_connectivity(g, startX, startY, endX, endY) {
        if(startX === endX && startY === endY) 
            return true;
        g[startX][startY] = true;

        // 上下左右偏移量，ACWing756.蛇形矩阵
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for(let i = 0; i < 4; i++) {
            let x = startX + dx[i], y = startY + dy[i];
            // 判断如果没有撞墙，并且可以走到终点的话，
            if(!g[x][y] && this.check_connectivity(g, x, y, endX, endY))
                return true;
        }
        return false;
    }

    create_walls() {
        const g = [];
        for(let r = 0; r < this.rows; r++) {
            g[r] = [];
            for(let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        // 给左右两列加上障碍物
        for(let r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = true;
        }
        // 给上下两行加上障碍物
        for(let c = 0; c < this.cols; c++) {
            g[0][c] = g[this.cols - 1][c] = true;
        }
        // 创建随机障碍物，每次会放两个，所以this.inner_walls_count要除以2
        for(let i = 0; i < this.inner_walls_count / 2; i++) {
            for(let j = 0; j < 1000; j++) {
                // Math.random()返回[0,1)的浮点数
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                // 左下角和右上角两个位置是蛇的起始位置，不能放障碍物
                if(r === this.rows - 2 && c === 1 || r === 1 && c === this.cols - 2) 
                    continue;
                // 内部障碍物是沿对角线对称放的，如果其中一个设置为true的话，另外一个就不用额外设置了
                if(g[r][c] || g[c][r]) 
                    continue;
                // 障碍物是沿对角线对称放的
                g[r][c] = g[c][r] = true;
                break;
            }
        }

        // 把当前状态复制一遍，防止当前状态被意外修改，
        // 在js中深度复制一个对象，先把它转换成JSON，再把JSON解析出来
        const copy_g = JSON.parse(JSON.stringify(g));
        // 要检查两个蛇之间的区域是否有联通的部分，如果不连通就变成单人游戏了
        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) 
            return false;

        // 渲染所有障碍物
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                if(g[r][c]) {
                    this.walls.push(new WallObject(r, c, this));
                }
            }
        }

        return true;
    }

    start() {
        for(let i = 0; i < 1000; i++) 
            if(this.create_walls()) 
                break;
            
        
        
    }

    update_size() {
        // 由于parent的宽和高是基于窗口大小的，且要把宽和高都分成13份，每个小格子边长L应该取的是二者的最小值
        // 如果不取整，画出来的地图会有缝隙，是由于上面计算出来的L是浮点数，但是画图使用整像素来画的，所以有些像素就没有了
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++) {
                // 这个逻辑是怎么回事？
                if((r + c) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }

    }
}