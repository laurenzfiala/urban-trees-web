import {LogLevel} from '../app/modules/trees/entities/log-level.entity';

/**
 * Environment config for local testing.
 */
export const environment = {

  production:                         true,

  webHost:                            'https://cobs.laurenz.dev',
  host:                               'https://cobs.laurenz.dev/api',
  mapHost:                            'http://urban-tree-climate.sbg.ac.at:80',

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
    beaconSettings:                   '/beacon/{beaconId}/settings',

    // Phenology
    phenologySpec:                    '/tree/{treeId}/phenology/spec',
    phenologyDatasetSubmission:       '/tree/{treeId}/phenology',
    phenologyDatasetImageSubmission:  '/user/phenology/observation/{phenologyId}/image',
    phenologyHistory:                 '/user/{userId}/phenology',

    // UI
    phenologyObservationResultImg:    '/ui/phenology/observation/result/{treeSpeciesId}/{resultId}/img',
    announcements:                    '/ui/announcements',

    // User
    userAchievements:                 '/user/achievements',
    userData:                         '/user/data',
    userDelete:                       '/user/delete',
    userReport:                       '/user/report',

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
    usersBulkAction:                  '/admin/users/bulk/{action}?tid={tid}',
    loadRole:                         '/admin/users/roles',
    deleteUser:                       '/admin/users/{userId}',
    expireCredentials:                '/admin/users/{userId}/expireCredentials',
    activate:                         '/admin/users/{userId}/activate',
    inactivate:                       '/admin/users/{userId}/inactivate',
    addRoles:                         '/admin/users/{userId}/roles/add',
    removeRoles:                      '/admin/users/{userId}/roles/remove',
    loginKey:                         '/admin/users/{userId}/loginkey',
    loginQr:                          '/admin/users/{userId}/loginkey/qr',
    bulkLoginQr:                      '/admin/users/loginkey/qr?tid={tid}',
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
    loadContent:                      '/content?path={contentPath}&lang={contentLang}',
    saveContentDraft:                 '/content/draft?path={contentPath}&lang={contentLang}',
    loadContentFile:                  '/content/file/{fileUid}?path={contentPath}&filename={filename}',
    saveContentFile:                  '/content/file?path={contentPath}',
    publishContent:                   '/content?path={contentPath}&lang={contentLang}',
    deleteContent:                    '/content/{contentUid}?draftOnly={draftOnly}',
    loadContentUserHistory:           '/user/{userId}/content?path={path}',

    // CMS Manager
    managerContentAccessViewable:     '/manage/content/access/viewable',
    managerContentAccessApprovable:   '/manage/content/access/approvable',
    managerContentViewable:           '/manage/content/viewable?accessId={accessId}',
    managerContentApprovable:         '/manage/content/approvable?accessId={accessId}',
    managerContent:                   '/manage/content/{contentUid}',
    managerApproveContent:            '/manage/content/{contentUid}/approve',
    managerDenyContent:               '/manage/content/{contentUid}/deny'
  },

  contentSaveDebounceMs:              120_000,
  contentUndoHistoryDebounceMs:       10_000,
  searchDebounceMs:                   200,
  searchDebounceApiMs:                500,

  defaultTimeout:                     30_000,
  imageUploadTimeout:                 60_000,
  bulkTimeout:                        240_000,

  userDataRefreshIntervalMs:          30_000,

  outputDateFormat:                   'YYYY-MM-DD[T]HH-mm-ss',

  log: {
    level:                            LogLevel.TRACE
  },

  security: {
    minUsernameLength:                  5,
    minPasswordLength:                  10,
    jwtTokenExpireMs:                   432000000,
    adminTimeoutMs:                     3600000,

    interceptorRedirectExclusions:      ['/login'],

    roles: {
      user:                             ['ROLE_USER'],
      treeEditor:                       ['ROLE_TREE_EDITOR'],
      journal:                          ['ROLE_JOURNAL', 'ROLE_PUPIL'],
      teacher:                          ['ROLE_TEACHER'],
      phenObs:                          ['ROLE_PHENOBS'],
      allData:                          ['ROLE_ALL_DATA', 'ROLE_ADMIN'],
      admin:                            ['ROLE_ADMIN'],
      adminLocked:                      ['ROLE_ADMIN_LOCKED'],
      tempChangePassword:               'ROLE_TEMP_CHANGE_PASSWORD',
      tempNoPassword:                   'ROLE_TEMP_NO_PASSWORD',
      tempLoginLink:                    'ROLE_TEMP_LOGIN_LINK',
      tempActivateOTP:                  'ROLE_TEMP_ACTIVATE_OTP'
    }
  }

};
