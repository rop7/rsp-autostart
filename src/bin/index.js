#!/usr/bin/env -S node --no-warnings

import api from '../api/index.js'
import RSp from '@ropsoft/rsp-libcorejs'

const main = () => {
  
  new RSp.Cli('rsp-autostart', {

    list: {
      description: 'List all entries',
      example: 'rsp-autostart list',
      execute: () => {
        api.list()
      }
    },

    open: {
      description: 'Open an entry with proper application',
      example: 'rsp-autostart open <entry_name>',
      execute: () => {
        api.open()
      }
    },

    reindex: {
      description: 'Reindex all entries',
      example: 'rsp-autostart reindex',
      execute: () => {
        api.reindex()
      }
    },

    validate: {
      description: 'Validate an entry',
      example: 'rsp-autostart validate <entry_name>',
      execute: () => {
        api.validate()
      }
    }
  })
}

main()

export default main;