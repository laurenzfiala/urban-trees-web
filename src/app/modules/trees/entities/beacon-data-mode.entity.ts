/**
 * Requested beacon data mode passed by the component to
 * the beacon service.
 * @author Laurenz Fiala
 * @since 2018/11/10
 */

export enum BeaconDataMode {

  LAST_24H = 'tree.beacon.data.mode.24h',
  LAST_WEEK = 'tree.beacon.data.mode.week',
  TEMP_LAST_MONTH_PER_DAY = 'tree.beacon.data.mode.temp_month_per_day',
  HUMI_LAST_MONTH_PER_DAY = 'tree.beacon.data.mode.humidity_month_per_day'

}
