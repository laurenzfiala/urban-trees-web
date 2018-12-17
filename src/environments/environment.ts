import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                       false,

  host:                             'http://192.168.0.80:80',
  mapHost:                          'http://192.168.0.80:8081',

  endpoints: {
    // Tree
    tree:                             '/tree/{treeId}',
    allTrees:                         '/tree',
    statistics:                       '/ui/statistics',
    cities:                           '/tree/cities',
    species:                          '/tree/species',
    beaconData:                       '/beacon/{beaconId}/data',
    beaconDataTimespan:               '/beacon/{beaconId}/data?timespanMin={timespanMin}&timespanMax={timespanMax}',
    beaconDataTimespanMin:            '/beacon/{beaconId}/data?timespanMin={timespanMin}',
    beaconDataTimespanMax:            '/beacon/{beaconId}/data?timespanMax={timespanMax}',

    // Phenology
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/usercontent/phenology/observation/{phenologyId}/image',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements',

    // Admin
    addCity:                          '/admin/city',
    addTree:                          '/admin/tree',

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
      user:                           ['ROLE_USER'],
      phenObs:                        ['ROLE_PHENOBS'],
      admin:                          ['ROLE_ADMIN']
    }
  }

};
