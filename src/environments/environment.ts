import {LogLevel} from '../app/modules/trees/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                         false,

  webHost:                            'http://localhost:4200',
  host:                               'http://localhost:80',
  mapHost:                            'http://localhost:8081',

  endpoints: {
    // Tree
    tree:                             '/tree/{treeId}',
    allTrees:                         '/tree',
    measurementsStatistics:           '/ui/statistics/measurements',
    systemStatistics:                 '/ui/statistics/system',
    cities:                           '/tree/cities',
    species:                          '/tree/species',
    loadBeacons:                      '/beacon',
    loadBeacon:                       '/beacon/{beaconId}',
    beaconData:                       '/beacon/{beaconId}/data',
    beaconDataTimespan:               '/beacon/{beaconId}/data?timespanMin={timespanMin}&timespanMax={timespanMax}',
    beaconDataTimespanMin:            '/beacon/{beaconId}/data?timespanMin={timespanMin}',
    beaconDataTimespanMax:            '/beacon/{beaconId}/data?timespanMax={timespanMax}',
    beaconSettings:                   '/beacon/{beaconId}/settings',

    // Phenology
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/user/phenology/observation/{phenologyId}/image',
    phenologyHistory:                 '/user/{userId}/phenology',

    // User
    userAchievements:                 '/user/achievements',
    userData:                         '/user/data',
    userDelete:                       '/user/delete',
    userReport:                       '/user/report',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements',

    // Admin
    addCity:                          '/admin/city',
    addTree:                          '/admin/tree',
    addUsers:                         '/admin/users',
    modifyTree:                       '/admin/tree/{treeId}',
    phenologyObservationTypes:        '/admin/phenology/types',
    addBeacon:                        '/admin/beacon',
    modifyBeacon:                     '/admin/beacon/{beaconId}',
    deleteBeacon:                     '/admin/beacon/{beaconId}',
    loadBeaconLogs:                   '/admin/beacon/logs',
    loadUsers:                        '/admin/users?offset={offset}{limit}',
    usersBulkAction:                  '/admin/users/bulk/{action}',
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
    allReports:                       '/admin/report?resolved=false',
    updateReportRemark:               '/admin/report/{reportId}/remark',
    unresolveReport:                  '/admin/report/{reportId}/unresolve',
    resolveReport:                    '/admin/report/{reportId}/resolve',

    // Authentication
    login:                            '/login',

    // Account
    changePassword:                   '/account/changepassword',
    changeUsername:                   '/account/changeusername',
    usingOtp:                         '/account/otp',
    activateOtp:                      '/account/otp/activate',
    deactivateOtp:                    '/account/otp/deactivate',
    addUserPermission:                '/account/permission/request',
    usersGrantingPermission:          '/account/permission/granted/{permission}',
    loadPPIN:                         '/account/permission/pin',

    // CMS
    loadContent:                      '/content/{contentId}/{contentLang}',
    saveContentDraft:                 '/content/{contentId}/{contentOrder}/{contentLang}/draft',
    publishContent:                   '/content/{contentId}/{contentOrder}/{contentLang}',
    loadContentUserHistory:           '/user/{userId}/content',
    loadContentUserHistoryWithPrefix: '/user/{userId}/content?prefix={prefix}'
  },

  contentSaveDebounceMs:              30_000,
  searchDebounceMs:                   200,
  searchDebounceApiMs:                500,

  defaultTimeout:                     30000,
  imageUploadTimeout:                 60000,

  userDataRefreshIntervalMs:          30000,

  outputDateFormat:                   'YYYY-MM-DD[T]HH-mm-ss',

  log: {
    level:                            LogLevel.TRACE
  },

  security: {
    minUsernameLength:                  5,
    minPasswordLength:                  10,
    jwtTokenExpireMs:                   86400000,
    adminTimeoutMs:                     1800000,

    interceptorRedirectExclusions:      ['/login'],

    roles: {
      user:                             ['ROLE_USER'],
      treeEditor:                       ['ROLE_TREE_EDITOR'],
      journal:                          ['ROLE_JOURNAL'],
      phenObs:                          ['ROLE_PHENOBS'],
      admin:                            ['ROLE_ADMIN'],
      tempChangePassword:               'ROLE_TEMP_CHANGE_PASSWORD',
      tempActivateOTP:                  'ROLE_TEMP_ACTIVATE_OTP'
    }
  }

};
