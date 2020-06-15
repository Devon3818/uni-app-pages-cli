#!/usr/bin/env node

const program = require('commander'); // (normal include)
const { resolve } = require('path')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const stripJsonComments = require('strip-json-comments')


const _tpl = fs.readFileSync(path.join(__dirname, 'template.vue'), 'utf8')

const mkdir = ( dirPath ) => {
  return new Promise((resolve, reject) => {
    fs.access( dirPath, (err) => {
      if (err) {
        fs.mkdir( dirPath, (err) => {
          if (err) {
            console.log(chalk.red(
              err
            ))
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  })
}

const writeJson = ( file ) => {

  fs.readFile(file, function(err,data) {
      if(err){
        console.log(chalk.red(
          err
        ))
        process.exit(1)
      }
      var person = data.toString()
      person = JSON.parse( stripJsonComments( person ) )

      if (_root) {
        let _findIndex = person.subPackages.findIndex(data => {
          return `pages/${_root}` == data.root
        })

        if (_findIndex != -1) {
          if (_path) {

            let _findPathIndex = person.subPackages[_findIndex].pages.findIndex(data => {
              return `${_path}/index` == data.path
            })

            if (_findPathIndex != -1) {
              console.log(chalk.red(
                'The page already exists'
              ))
              process.exit(1)
            }

            person.subPackages[_findIndex].pages.push({
              path: `${_path}/index`,
              style: {
                navigationBarTitleText: ''
              }
            })
          } else {
            console.log(chalk.red(
              'The root directory for the subpackage already exists'
            ))
            process.exit(1)
          }
        } else {
          person.subPackages.push({
            "root": `pages/${_root}`,
            "pages": _path ? [{
              path: `${_path}/index`,
              style: {
                navigationBarTitleText: ''
              }
            }] : []
          })
        }
      }

      if (_path && !_root) {
        let _p = person.pages.filter(page => {
          return page.path == `pages/${_path}/index`
        })
        if (_p.length) {
          console.log(chalk.red(
            'The page already exists'
          ))
          process.exit(1)
        } else {
          person.pages.push({
            path: `pages/${_path}/index`,
            style: {
              navigationBarTitleText: ''
            }
          })
        }
      }

      let str = JSON.stringify(person, null, "\t")
      fs.writeFile(file,str, {flag: 'w'}, function(err) {
        if(err){
          return console.log(chalk.red(
            err
          ))
        } else {
          console.log(chalk.green(
            'added successfully'
          ))
        }
      })
  })
}

const _pagesJsonFile = path.join(resolve('./'), 'pages.json')

let _root,_path

program
  .option('-v, --VERSION', 'version message')
  .option('-r, --root <root>', 'add subPackages root')
  .option('-p, --path <path>', 'add page')
  .parse(process.argv)

_root = program.root ? program.root : null
_path = program.path ? program.path : null

fs.access( _pagesJsonFile , (err) => {
  if(err) {
    console.log(chalk.red(
      'pages.json file not found'
    ))
    process.exit(1)
  }
})

fs.access( path.join(resolve('./'), 'pages') , (err) => {
  if(err) {
    console.log(chalk.red(
      'pages directory does not exist'
    ))
    process.exit(1)
  }
})

if (_root) {
  let _rootPath = path.join(resolve('./pages/'), _root)
  mkdir(_rootPath).then(() => {
    if (_path) {
      let _pathPath = path.join(_rootPath, _path)
      mkdir(_pathPath).then(() => {
        fs.writeFile(path.join( _pathPath, 'index.vue' ), _tpl, function(err) {
          if(err){
            console.log(chalk.red(
              err
            ))
            process.exit(1)
          } else {
            writeJson( _pagesJsonFile )
          }
        })
      })
    } else {
      writeJson( _pagesJsonFile )
    }
  })
}

if (_path && !_root) {
  let _pathPath = path.join(resolve('./pages/'), _path)
  mkdir(_pathPath).then(() => {
    fs.writeFile(path.join( _pathPath, 'index.vue' ), _tpl, function(err) {
      if(err){
        console.log(chalk.red(
          err
        ))
        process.exit(1)
      } else {
        writeJson( _pagesJsonFile )
      }
    })
  })
}
