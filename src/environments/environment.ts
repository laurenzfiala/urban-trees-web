import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                       false,

  // host:                             'http://192.168.1.100:80',
  host:                             'http://localhost:80',
  // mapHost:                          'http://192.168.1.100:8081',
  mapHost:                          'http://localhost:8081',

  endpoints: {
    // Tree
    tree:                             '/tree/{treeId}',
    allTrees:                         '/tree',
    statistics:                       '/ui/statistics',
    cities:                           '/tree/cities',
    beaconData:                       '/beacon/{beaconId}/data',

    // Phenology
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/usercontent/phenology/observation/{phenologyId}/image',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements',

    // Authentication
    login:                            '/login',
    changePassword:                   '/account/changepassword'
  },

  defaultTimeout:                     10000,
  imageUploadTimeout:                 60000,

  outputDateFormat:                   'YYYY-MM-DD[T]HH-mm-ss',

  log: {
    level:                            LogLevel.TRACE
  },

  security: {
    roles: {
      phenObs:                        ['ROLE_PHENOBS'],
      admin:                          ['ROLE_ADMIN']
    }
  }

};
