class Enigma {
    constructor() {
        // 字母表（接线板）
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

    // 报错
    error(messgae='undefined', type='Logic Error') {
        console.error(`[Enigma] ${type}: ${messgae}`);
        return;
    }

    // 转换为字符
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

    // 转换为数字
    toNum(value) {
        value = value.toUpperCase().substr(0,1);
        if (/[A-Z]/.test(value)) {
            return this.char.indexOf(value);
        } else {
            return value;
        }
    }

    // 计算转子走线
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

    // 输入字符
    charIn(value) {
        value = value.toUpperCase().substr(0,1);
        if (/[A-Z]/.test(value)) {
            let num = this.toNum(value);
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

    // 生成替换表
    charInTest() {
        let list = [];
        this.char.forEach(e => {
            list.push([e, this.charIn(e)])
        });
        return list;
    }

    // 拨动转子
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

    // 加密&解密字符串
    translate(text, rotors=this.rotorsLocation) {
        let output = '';
        this.rotorsLocation = rotors;
        for (let i = 0; i < text.length; i++) {
            let c = this.charIn(text.substr(i, 1));
            output += c;
            if (text.substr(i, 1) != c) this.rotorsNext();
        }

        return output;
    }

    // 设置转子
    setRotors(rotors) {
        this.rotors = rotors;
        return this.rotors;
    }

    // 设置转子位置
    setLocation(...value) {
        if (value.length != this.rotors.length) {
            return this.error('value.length != this.rotors.length');
        }

        for (let i = 0; i < value.length; i++) {
            if (value[i] >= this.rotors[i].length) {
                return this.error(`value[${i}] >= this.rotors[${i}].length`);
            }
            if (value[i] < 0) {
                return this.error(`value[${i}] < 0`);
            }
        }

        this.rotorsLocation = value;
        return this.rotorsLocation;
    }

    // 重置转子位置
    resetLocation() {
        this.rotorsLocation.fill(0);
        return this.rotorsLocation;
    }

    // 设置反射器
    setReflector(reflector) {
        this.reflector = reflector;
        return this.reflector;
    }
}