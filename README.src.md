## xixth<sup>js</sup>

- are a helper for:
  - starter project repository through npm;
  - binary creation;

## note

- the example are made using `npm` and `npx`, you can also use other packge manager, however you
  need to stick with single package manager due to binary installation are mainly binded to packager
  manger you use to install the package;
  - impliying you can also uses `bun` and `bunx` and other equivalent;

## installation

on terminal

```shell
npm i xixth
```

## register binary script to your package

on terminal:

```shell
npx xixth-add-bin -n your-script-name -f script-file-name-with-ext.mjs
```

- both `-n` and `-f` flags and its value are mandatory;
- best practice of naming `your-script-name` is to add your `package-name` to avoid global script
  name collision;

edit your newly created `script file`;

- use [xixth documentation](#xixth);

## uses

you can run this binary whether its:

- installed through `npm`;
- symlinked using `link` package manager `api`;

which then you can calls it using:

```shell
npx your-script-name
```
