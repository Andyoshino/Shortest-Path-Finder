<script>
export default {
    name: 'Grid',
    data() {
        return {
            grid: [],
            startingNode: -1,
            destinationNode: -1,
            action: -1,
            mousedown: false,
            showError: false
        }
    },
    methods: {
        node_click_event(idx, isDragged) {

            if (isDragged && !this.mousedown) {
                return;
            }

            if (this.action === -1) return;
            if (this.action === 1) {
                if (this.startingNode !== -1) this.grid[this.startingNode] = 0;
                if (idx === this.destinationNode) this.destinationNode = -1;
                this.startingNode = idx;
            }

            if (this.action === 2) {
                if (this.destinationNode !== -1) this.grid[this.destinationNode] = 0;
                if (idx === this.startingNode) this.startingNode = -1;
                this.destinationNode = idx;
            }
            this.grid[idx] = this.action;
        },
        async find_shortest_path() {

            this.action = -1;

            if (this.startingNode === -1 || this.destinationNode === -1) {
                this.showError = true;
                return;
            }
            this.showError = false;

            let q = [];
            let vis = [];
            let dx = [1, -1, 0, 0], dy = [0, 0, 1, -1];
            let front = -1;
            let parent = [];
            let portal1 = [];
            let portal2 = [];

            for (let i = 0; i < 100; i++) {
                if (this.grid[i] >= 10) this.grid[i] = 0;
                if (this.grid[i] === 4) portal1.push(i);
                else if (this.grid[i] === 5) portal2.push(i);
            }

            console.log(portal1);
            console.log(portal2);

            for (let i = 0; i < 100; i++) {
                vis.push(false);
                parent.push(-1);
            }
            vis[this.startingNode] = true;
            q.push(this.startingNode);

            while (q.length !== 0 && !vis[this.destinationNode]) {
                front = q.shift();

                if (this.grid[front] === 4) {
                    for (let i = 0; i < portal1.length; i++) {
                        let idx = portal1[i];
                        console.log("bro?");
                        if (!vis[idx]) {
                            q.push(idx);
                            parent[idx] = front;
                            vis[idx] = true;
                        }
                    }
                }
                if (this.grid[front] === 5) {
                    for (let i = 0; i < portal2.length; i++) {
                        let idx = portal2[i];
                        console.log("bri?");
                        if (!vis[idx]) {
                            q.push(idx);
                            parent[idx] = front;
                            vis[idx] = true;
                        }
                    }
                }

                for (let i = 0; i < 4; i++) {
                    let newCell = this.get_coords(front);
                    newCell.r += dx[i];
                    newCell.c += dy[i];
                    if (this.is_inside(newCell) && !vis[this.get_index(newCell)] && this.grid[this.get_index(newCell)] !== 3) {
                        q.push(this.get_index(newCell));
                        vis[this.get_index(newCell)] = true;
                        parent[this.get_index(newCell)] = front;
                        await this.delay(35);
                        if (this.get_index(newCell) !== this.destinationNode && this.grid[this.get_index(newCell)] !== 4 && this.grid[this.get_index(newCell)] !== 5) this.grid[this.get_index(newCell)] = 10;
                    }
                }
            }

            if (vis[this.destinationNode]) {
                let now = parent[this.destinationNode];
                let path = [];
                while (now !== this.startingNode) {
                    path.push(now);
                    now = parent[now];
                }
                console.log(path);
                path.reverse();
                console.log(path);
                for (let i = 0; i < path.length; i++) {
                    await this.delay(30);
                    if (this.grid[path[i]] !== 4 && this.grid[path[i]] !== 5) this.grid[path[i]] = 11;
                }
            }

        },
        delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        get_coords(index) {
            return {
                r: Math.floor(index / 10),
                c: index % 10
            };
        },
        get_index(coords) {
            return coords.r * 10 + coords.c;
        },
        is_inside(coords) {
            return coords.r >= 0 && coords.r <= 9 && coords.c >= 0 && coords.c <= 9;
        },
        turnon() {
            this.mousedown = true;
        },
        turnoff() {
            this.mousedown = false;
        },
        clear() {
            for (let i = 0; i < 100; i++) {
                this.grid[i] = 0;
            }
        }
    },
    mounted() {
        for (let i = 0; i < 100; i++) {
            this.grid.push(0);
        }
    }
}
</script>
<template>
    <div class="HelloWorld">
        <div class="flex mx-auto w-fit mt-12">
            <div class="flex flex-wrap w-[680px]" @mousedown="turnon()" @mouseup="turnoff()" @mouseleave="turnoff()">
                <div @mouseleave="node_click_event(index, true)" @mouseenter="node_click_event(index, true)"
                     @click="node_click_event(index, false)" v-for="(cell, index) in grid" v-bind:key="index"
                     class="w-[60px] h-[60px] ml-[8px] mb-[8px] rounded-md overflow-hidden shadow-lg"
                     v-bind:class="{'animate-quick-zoom' : grid[index] === 10, 'animate-path' : grid[index] === 11}">
                    <div class="mx-auto text-white w-full h-full flex bg-gradient-to-tl"
                         v-bind:class="{'from-pink-100 to-cyan-50' : grid[index] === 0, 'from-lime-400 to-green-500' : grid[index] === 1, 'from-red-400 to-pink-500' : grid[index] === 2, 'from-slate-700 to-pink-600' : grid[index] === 3, 'from-violet-400 to-indigo-200' : grid[index] === 4, 'from-yellow-300 to-orange-400' : grid[index] === 5, 'from-sky-700 to-blue-800' : grid[index] === 10, 'from-lime-200 to-green-300' : grid[index] === 11}">
                        <div class="m-auto text-sm"></div>
                    </div>
                </div>
            </div>

            <div class="ml-2 w-[256px] h-[672px] h-full bg-gradient-to-tr from-blue-300 to-sky-200 rounded-md p-6">

                <button @click="action = 1"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-lime-400 to-green-500 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-lime-500">Starting Cell</span>
                </button>

                <button @click="action = 2"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-red-400 to-pink-500 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-pink-500">Destination Cell</span>
                </button>

                <button @click="action = 3"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-slate-700 to-pink-600 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-slate-500">Obstacle</span>
                </button>

                <button @click="action = 4"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-violet-400 to-indigo-200 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-violet-500">Portal 1</span>
                </button>

                <button @click="action = 5"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-yellow-300 to-orange-400 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-orange-500">Portal 2</span>
                </button>

                <button @click="action = 0"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-gray-200 to-rose-200 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-rose-500">Purify A Cell</span>
                </button>

                <button @click="clear()"
                        class="text-left shadow-md mb-3 px-3 py-1.5 block bg-gradient-to-br from-slate-600 to-gray-700 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-rose-500">Clear Grid</span>
                </button>

                <button @click="find_shortest_path()"
                        class="text-left hover:animate-wiggle shadow-md mb-8 px-3 py-1.5 block bg-gradient-to-br from-emerald-300 to-rose-300 rounded-tr-md rounded-bl-md transition hover:scale-110">
                    <span class="bg-white px-2 font-sans underline decoration-rose-500">Find Shortest Path!</span>
                </button>

                <div class="bg-white py-4 px-3 text-justify h-48 overflow-hidden flex">

                    <div class="my-auto">
                        <span v-bind:class="{'hide' : showError}">
                            You may <span class="font-semibold underline decoration-pink-400">hold and drag</span> or <span class="font-semibold underline decoration-pink-400">click</span> your cursor to draw something to the grid.
                        </span>

                        <span v-bind:class="{'hide' : !showError}">
                            You need to have <span class="font-semibold underline decoration-pink-400">both starting and destination cell</span> before clicking the find shortest path button!
                        </span>
                        <button @click="showError = false" v-bind:class="{'hide' : !showError}" class="bg-gradient-to-b from-rose-400 to-pink-500 h-7 w-7 rounded-full text-white">
                            ok
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<style>
.hide {
    display: none;
}
</style>
