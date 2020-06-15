# uni-app-pages-cli

uni-app 开发中根据规则自动生成页面目录和配置页面路径，使得开发者不需要手动的去添加页面配置到 pages.json和创建文件目录

新的page页面目录会生成在根目录的pages目录下

## 安装

> npm install -g uni-app-pages-cli

## 使用

```
用法：uni-add [options]


选项：

  -v, --VERSION                   版本号
  -r, --root <rootName>           添加分包加载配置 root 目录
  -p, --path <pageName>           添加 pages 节点配置

```

## 示例


> uni-add -r TEST

```
"subPackages": [
  {
    "root": "pages/TEST"
  }
]
```

> uni-add -p page

```
"pages": [
  {
    "path": "pages/page/index",
    "style": {
      "navigationBarTitleText": ""
    }
  }
]
```

> uni-add -r TEST -p page

```
"subPackages": [
  {
    "root": "pages/TEST",
    "pages" [{
      "path": "page/index",
        "style": {
          "navigationBarTitleText": ""
        }
    }]
  }
]
```
