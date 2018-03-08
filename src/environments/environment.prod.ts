import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                         false,

  host:                               'http://141.201.106.39:8080',
  mapHost:                            'http://141.201.106.39:80',

  endpoints: {
    // Phenology
    allTrees:                         '/tree',
    findTrees:                        '/tree/find?search={searchString}',
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/usercontent/phenology/observation/{phenologyId}/image',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements'
  },

  defaultTimeout:                     10000,
  imageUploadTimeout:                 60000,

  outputDateFormat:                 'YYYY-MM-DD[T]HH-mm-ss',

  log: {
    level:                            LogLevel.TRACE
  }

};
