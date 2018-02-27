import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                       false,

  host:                             'http://192.168.1.104:80',
  mapHost:                          'http://192.168.1.104:8081',

  endpoints: {
    // Phenology
    allTrees:                       '/tree',
    phenologySpec:                  '/tree/{treeId}/phenology/spec',
    phenologyObservationSubmission: '/tree/{treeId}/phenology',

    // UI
    phenologyObservationResultImg:  '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                  '/ui/announcements'
  },

  defaultTimeout:                   10000,

  log: {
    level:                          LogLevel.TRACE
  }

};
