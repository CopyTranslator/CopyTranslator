import { Dict } from "./tools/dict";
enum Hello {
  First,
  Second,
  Third
}

const dict = Dict([[Hello.First, "hello 1"], [Hello.Third, "hello 2"]]);
console.log(dict(Hello.Third));
