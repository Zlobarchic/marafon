class Foo {
    bar = 1;

    bla = () => console.log(this.bar);

    baz = function () { console.log(this.bar); };
}

new Foo().bla(); // ?
new Foo().baz(); // ?

// -------------------------- //

class Parent {
    foo() {
        console.log('It works!');
    }
}

class Example extends Parent {}

partial(Example, {
    foo() {
        super.foo();
        console.log('Yeaaah');
    },

    get bar() {
        return Math.random();
    }
});

const example = new Example();

function partial(target, mixin) {
    Object.setPrototypeOf(mixin, Object.getPrototypeOf(target.prototype));
    Object.defineProperties(target.prototype, Object.getOwnPropertyDescriptors(mixin));
}
example.foo(); // It works! Yeaaah

console.log(example.bar); // Случайное число
console.log(example.bar); // Случайное число
console.log(example.bar); // Случайное число
// -------------------------------- //

console.log(format('Hello ${name}! May age is ${age * 2}.', {name: 'Bob', age: 12})); // 'Hello Bob! My age is 24.'

function format(str, params) {
    return str.replace(/\${(.*?)}/g, (_, expr) => {
        console.log(expr)
        return Function(...Object.keys(params), `return ${expr}`)(...Object.values(params));
    })
}

// --------------------------------- //

allSettled([1, Promise.resolve(2), Promise.reject(3)]).then(([v1, v2, v3]) => {
    console.log(v1); // {status: 'fulfilled', value: 1}
    console.log(v2); // {status: 'fulfilled', value: 2}
    console.log(v3); // {status: 'rejected', reason: 3}
});

function allSettled(iter) {
    const promises = [...iter].map((el) => Promise.resolve(el));
    const res = new Array(promises.length);
    let total = 0;

    return new Promise((resolve) => {
        promises.forEach((promise, i) => {
            promise
                .then((value) => {
                    res[i] = {
                        status: 'fulfilled',
                        value
                    }
                    total++;

                    if (total >= promises.length) {
                        resolve(res);
                    }
                })
                .catch((error) => {
                    res[i] = {
                        status: 'rejected',
                        error
                    }

                    total++;

                    if (total >= promises.length) {
                        resolve(res);
                    }
                })
        })
    })
}