
// 求实数轴上两点之间的距离
function distance(p1: number, p2: number): number {
    return Math.abs(p1 - p2)
}

// 求二维平面上两点之间的距离
function distance2(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

// 求三维空间中两点之间的距离
function distance3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2))
}

// 通用函数
// 缺点：不同的类型不能比较，无法在编译期报错，只能在运行期抛出异常
function genericDistance(p1: number[], p2: number[]): number {
    if (p1.length == 0 || p2.length == 0) {
        throw Error("length must greater then zero.")
    }

    if (p1.length != p2.length) {
        throw Error("p1's length must equals p2's length.")
    }

    let sum = 0;
    for (let i = 0; i < p1.length; i++) {
        sum += Math.pow(p1[i] - p1[i], 2)
    }
    return Math.sqrt(sum)
}

// 定义接口
interface Distance<P> {
    distance(p: P): number
}

// 二维平面点
class Point implements Distance<Point> {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distance(p: Point): number {
        return Math.sqrt(
            Math.pow(this.x - p.x, 2) 
            + Math.pow(this.y- p.y, 2)
        )
    }
}

// 三维立体点
class Cubic implements Distance<Cubic> {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distance(c: Cubic): number {
        return Math.sqrt(
            Math.pow(this.x - c.x, 2) 
            + Math.pow(this.y- c.y, 2) 
            + Math.pow(this.z - c.z, 2)
        )
    }
}

// 平面曼哈顿距离
class ManhattanPoint extends Point implements Distance<ManhattanPoint>{
    distance(mp: ManhattanPoint): number {
        return Math.abs(this.x - mp.x) + Math.abs(this.y- mp.y)
    }
}

// 立体曼哈顿距离
class ManhattanCubic extends Cubic implements Distance<ManhattanCubic>{
    distance(mc: ManhattanCubic): number {
        return Math.abs(this.x - mc.x) + Math.abs(this.y- mc.y) + Math.abs(this.z - mc.z)
    }
}
