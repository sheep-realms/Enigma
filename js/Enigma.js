class Enigma {
    constructor() {
        // 字母表
        this.char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        // 转子
        this.rotors = [
            [5, 15, 16, 4, 25, 2, 12, 24, 22, 9, 19, 13, 8, 10, 6, 20, 0, 17, 3, 11, 21, 1, 23, 14, 7, 18],
            [10, 9, 16, 14, 19, 1, 0, 6, 23, 8, 17, 24, 5, 13, 12, 20, 7, 2, 3, 21, 4, 11, 25, 15, 18, 22],
            [22, 7, 11, 25, 8, 1, 0, 12, 13, 10, 6, 16, 9, 21, 17, 2, 24, 19, 5, 4, 18, 14, 15, 3, 23, 20]
        ];
        // 转子位置
        this.rotorsLocation = [0, 0, 0];
        // 反射器
        this.reflector = [6, 9, 25, 17, 15, 8, 0, 10, 5, 1, 7, 22, 18, 24, 20, 4, 21, 3, 12, 23, 14, 16, 11, 19, 13, 2];
    }

    toChar(value) {
        if (!isNaN(value)) {
            if (value < 26) {
                return this.char[value];
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    toNum(value) {
        value = value.toUpperCase().substr(0,1);
        if (/[A-Z]/.test(value)) {
            return this.char.indexOf(value);
        } else {
            return value;
        }
    }

    calcRotors(value, value2, reflex=false) {
        if (reflex) {
            value -= value2;
            if (value < 0) value += 26;
        } else {
            value += value2;
            if (value > 25) value -= 26;
        }
        return value;
    }

    getRotorsNav(value) {
        let x = [];
        x = x.concat(this.rotorsLocation);
        for(let i = 0; i < x.length; i++) {
            x[i] = this.calcRotors(x[i], value);
        }
        return x;
    }

    charIn(value) {
        value = value.toUpperCase().substr(0,1);
        if (/[A-Z]/.test(value)) {
            let num = this.toNum(value);
            let rotorsNav = this.getRotorsNav(num);
            let x = num;

            // 进入转子
            for (let i = 0; i < this.rotors.length; i++) {
                x = this.rotors[i][this.calcRotors(this.rotorsLocation[i], x)];
            }

            // 进入反射器
            x = this.reflector[x];

            // 离开转子
            for (let i = this.rotors.length - 1; i >= 0; i--) {
                x = this.calcRotors(this.rotors[i].indexOf(x), this.rotorsLocation[i], true);
            }

            return this.toChar(x);
        } else {
            return value;
        }
    }

    charInTest() {
        let list = [];
        this.char.forEach(e => {
            list.push([e, this.charIn(e)])
        });
        return list;
    }

    rotorsNext() {
        this.rotorsLocation[0]++;
        for (let i = 0; i < this.rotorsLocation.length; i++) {
            if (this.rotorsLocation[i] >= this.rotors[i].length) {
                this.rotorsLocation[i] = 0;
                if (i + 1 < this.rotorsLocation.length) {
                    this.rotorsLocation[i + 1]++;
                }
            }
        }
        return this.rotorsLocation;
    }

    translate(text, rotors=this.rotorsLocation) {
        let output = '';
        this.rotorsLocation = rotors;
        for (let i = 0; i < text.length; i++) {
            output += this.charIn(text.substr(i, 1));
            this.rotorsNext();
        }

        return output;
    }
}