import { fail, succeed } from ".";

const [err1, val1] = succeed(42);
// err is undefined
// val is 42

const [err2, val2] = fail("error");
// err2 is an object with a description and timestamp
// val2 is undefined

const val3 = succeed("hello").failed((err) => {
  console.log(err);
});
// val3 is "hello"
// does not log anything

const val4 = fail("error").failed((err) => {
  console.log(err);
});
// val4 is undefined
// console logs "error"

const err3 = succeed("hello").failed((err) => {
  console.log(err);
});
// err3 is undefined
// does not log anything

const err4 = fail("error").failed((err) => {
  console.log(err);
});
// err4 is an object with a description and timestamp
// console logs "error"
