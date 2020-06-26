import {BootMixin} from '@loopback/boot'
import {ApplicationConfig} from '@loopback/core'
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer'
import {RepositoryMixin} from '@loopback/repository'
import {RestApplication} from '@loopback/rest'
import {ServiceMixin} from '@loopback/service-proxy'
import path from 'path'
import {MySequence} from './sequence'
import fs = require('fs')
import * as _ from 'lodash'

export {ApplicationConfig}

export class NotifyBcApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    let configFiles = [
      'config.json',
      'config.js',
      'config.local.json',
      'config.local.js',
    ]
    if (process.env.NODE_ENV) {
      configFiles = configFiles.concat([
        `config.${process.env.NODE_ENV}.json`,
        `config.${process.env.NODE_ENV}.js`,
      ])
    }
    for (const configFile of configFiles) {
      const f = path.join(__dirname, configFile)
      if (fs.existsSync(f)) {
        _.mergeWith(options, require(f), (t, s) => {
          if (_.isArray(t)) {
            return s
          }
        })
      }
    }
    super(options)

    // Set up the custom sequence
    this.sequence(MySequence)

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    })
    this.component(RestExplorerComponent)

    let dsFiles = ['db.datasource.local.json', 'db.datasource.local.js']
    if (process.env.NODE_ENV) {
      dsFiles = dsFiles.concat([
        `db.datasource.${process.env.NODE_ENV}.json`,
        `db.datasource.${process.env.NODE_ENV}.js`,
      ])
    }
    for (const dsFile of dsFiles) {
      const f = path.join(__dirname, 'datasources', dsFile)
      if (fs.existsSync(f)) {
        this.bind('datasources.config.db').to(require(f))
      }
    }
    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }
  }
}
