console.log('Hello');

//For Promise.all, Promise.allSettled, Promise.race, Prmoise.any

/** Promise.all Polyfill */
//Promise.all returns all the success promise or the first rejected promise
Promise.myAll = function (promises) {
  if (!Array.isArray(promises)) {
    throw new Error('provided argument is not of type Array');
  }
  return new Promise((res, rej) => {
    let results = [];
    if (!promises.length) return res(results); //Immedialtely return

    let completed = 0;
    let isRejected = false;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) res(results);
        })
        .catch((error) => {
          if (!isRejected) {
            //Prevent multiple calls to reject
            isRejected = true;
            rej(error);
          }
        });
    });
  });
};

/** Promise.race Polyfill */
//In Promise.race return the first setteled promise either success or fail
Promise.myRace = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('provided argument is not of type Array');
  }

  return new Promise((res, rej) => {
    if (!promises.length) return;

    for (const promise of promises) {
      Promise.resolve(promise).then(res, rej);
    }
  });
};

/** Promise.any Polyfill */
//In Promise.any return the first success promise, if no success promise return Aggregate error
Promise.myAny = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('Provided argument is not of type Array');
  }

  return new Promise((res, rej) => {
    let errors = [];
    let completed = 0;

    if (!promises.length)
      return rej(new AggregateError([], 'All promises were rejected'));

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(res)
        .catch((error) => {
          errors.push(error);
          completed++;
          if (completed === promises.length) {
            rej(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
};

/** Promise.allSettled Polyfill */
//In Promise.allSettled returns all the settled promises
Promise.myAllSettled = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('Provided argument is not of type Array');
  }

  return new Promise((res, rej) => {
    let results = [];
    let completed = 0;

    if (!promises.length) return res(results);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          results[index] = { status: 'fulfilled', val };
        })
        .catch((error) => {
          results[index] = { status: 'rejected', error };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) {
            res(results);
          }
        });
    });
  });
};

/*--- Test Cases ---*/

// const p1 = Promise.resolve('hello-1');
// const p2 = new Promise((res, _) =>
//   setTimeout(() => {
//     res('hello-2');
//   }, 1000)
// );

// Promise.myAll([p1, p2])
//   .then((val) => console.log(val))
//   .catch((val) => console.log(val));

// const p1 = Promise.resolve('hello-1');
// const p2 = Promise.reject('Error!');
// const p3 = new Promise((res) => setTimeout(() => res('hello-3'), 1000));

// Promise.myAll([p1, p2, p3])
//   .then(console.log)
//   .catch((err) => console.log('Rejected:', err));

// Promise.myAll([]).then(console.log); // Output: []

//Extra Question ->
/**
 * Create a function that takes an array of promises and executes them sequentially,
 * returning a single promise that resolves when all have been completed.
 */

async function myPromises(promises) {
  let results = [];
  for (let promise of promises) {
    results.push(await promise());
  }
  return results;
}

const p1 = () =>
  new Promise((res, rej) => setTimeout(() => res('test-1'), 1000));
const p2 = () =>
  new Promise((res, rej) => setTimeout(() => res('test-2'), 2000));
const p3 = () =>
  new Promise((res, rej) => setTimeout(() => res('test-3s'), 3000));

myPromises([p1, p2, p3]).then((val) => console.log(val));

const task1 = async () => {
  /** implementation */
  console.log('task1 done');
};

const task2 = async () => {
  /** implementation */
  console.log('task2 done');
};

const task3 = async () => {
  /** implementation */
  console.log('task3 done');
};

const callTasks = () => {
  task1();
  task2();
  task3();
};

callTasks();
