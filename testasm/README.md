## Install AssemblyScript Compiler

```bash
git clone https://github.com/AssemblyScript/assemblyscript.git
cd assemblyscript
npm install
npm link
```

run `asc` to check if it's installed correctly.

## Compile ts to wasm

```bash
npm run asbuild
```

then you can find `optimized.wasm`  under directory  `build`

## Test

open`index.html` ,open to see the console

type

```javascript
addfunc(1,2)
```

check the `index.ts` under the directory `assembly` to see the source.



