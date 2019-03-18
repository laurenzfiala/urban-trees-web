import {LogLevel} from '../app/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                         true,

  webHost:                            'https://urban-tree-climate.sbg.ac.at',
  host:                               'https://urban-tree-climate.sbg.ac.at:8443',
  mapHost:                            'http://141.201.106.39:80',

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
    beaconSettings:                   '/beacon/{beaconId}/settings',

    // Phenology
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/user/phenology/observation/{phenologyId}/image',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements',

    // User Content
    userContentById:                  '/content/{contentId}',
    userContentByTag:                 '/content/{contentTag}',

    // User
    userAchievements:                 '/user/achievements',

    // Admin
    addCity:                          '/admin/city',
    addTree:                          '/admin/tree',
    addUser:                          '/admin/user',
    modifyTree:                       '/admin/tree/{treeId}',
    phenologyObservationTypes:        '/admin/phenology/types',
    addBeacon:                        '/admin/beacon',
    deleteBeacon:                     '/admin/beacon/{beaconId}',
    loadUsers:                        '/admin/users',
    loadRole:                         '/admin/users/roles',
    deleteUser:                       '/admin/users/{userId}',
    expireCredentials:                '/admin/users/{userId}/expireCredentials',
    activate:                         '/admin/users/{userId}/activate',
    inactivate:                       '/admin/users/{userId}/inactivate',
    addRoles:                         '/admin/users/{userId}/roles/add',
    removeRoles:                      '/admin/users/{userId}/roles/remove',
    loginKey:                         '/admin/users/{userId}/loginkey',
    loginKeyUrl:                      '/login/{token}',
    allAnnouncements:                 '/admin/announcements',
    addAnnouncement:                  '/admin/announcement',
    deleteAnnouncement:               '/admin/announcement/{announcementId}',

    // Authentication
    login:                            '/login',
    changePassword:                   '/account/changepassword',
    changeUsername:                   '/account/changeusername'
  },

  defaultTimeout:                     30000,
  imageUploadTimeout:                 60000,

  outputDateFormat:                   'YYYY-MM-DD[T]HH-mm-ss',
  inputDateFormat:                    'YYYY-MM-DD[T]HH-mm-ss',

  log: {
    level:                            LogLevel.TRACE
  },

  security: {
    minUsernameLength:                5,
    minPasswordLength:                10,
    jwtTokenExpireMs:                 86400000,
    adminTimeoutMs:                   1800000,

    interceptorRedirectExclusions:    ['/login'],

    roles: {
      user:                           ['ROLE_USER'],
      phenObs:                        ['ROLE_PHENOBS'],
      admin:                          ['ROLE_ADMIN'],
      tempChangePassword:             'ROLE_TEMP_CHANGE_PASSWORD'
    }
  }

};
