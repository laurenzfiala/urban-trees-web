import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                       false,

  host:                             'http://141.201.106.39:80',
  mapHost:                          'http://141.201.106.39:80',

  endpoints: {
    // Phenology
    allTrees:                       '/api/tree',
    phenologySpec:                  '/api/tree/{treeId}/phenology/spec',
    phenologyObservationSubmission: '/api/tree/{treeId}/phenology',

    // UI
    phenologyObservationResultImg:  '/api/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                  '/api/ui/announcements'
  },

  defaultTimeout:                   10000,

  log: {
    level:                          LogLevel.TRACE
  }

};
