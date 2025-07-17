import api from '../api/index.js'
import RSp from 'file:///usr/lib/node_modules/rsp-libcore.js/index.js'

export default () => {
  
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
