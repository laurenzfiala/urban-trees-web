/**
 * Beacon settings.
 * @author Laurenz Fiala
 * @since 2019/01/01
 */

export class BeaconSettings {

  public id: number;
  public beaconId: number;
  public deviceName: string;
  public firmwareVersionCode: number;
  public transmitPowerDb: number;
  public batteryLevel: number;
  public temperatureUnits: number;
  public memoryCapacity: number;
  public refTime: string;
  public deviceId: number;
  public physicalButtonEnabled: boolean;
  public temperatureCalibration: number;
  public humidityCalibration: number;
  public loggingIntervalSec: number;
  public sensorIntervalSec: number;
  public advertisingFrequencyMs: number;
  public pin: number;
  public checkDate: string;

  constructor(
    id?: number,
    beaconId?: number,
    deviceName?: string,
    firmwareVersionCode?: number,
    transmitPowerDb?: number,
    batteryLevel?: number,
    temperatureUnits?: number,
    memoryCapacity?: number,
    refTime?: string,
    deviceId?: number,
    physicalButtonEnabled?: boolean,
    temperatureCalibration?: number,
    humidityCalibration?: number,
    loggingIntervalSec?: number,
    sensorIntervalSec?: number,
    advertisingFrequencyMs?: number,
    pin?: number,
    checkDate?: string
  ) {

    this.id = id;
    this.beaconId = beaconId;
    this.deviceName = deviceName;
    this.firmwareVersionCode = firmwareVersionCode;
    this.transmitPowerDb = transmitPowerDb;
    this.batteryLevel = batteryLevel;
    this.temperatureUnits = temperatureUnits;
    this.memoryCapacity = memoryCapacity;
    this.refTime = refTime;
    this.deviceId = deviceId;
    this.physicalButtonEnabled = physicalButtonEnabled;
    this.temperatureCalibration = temperatureCalibration;
    this.humidityCalibration = humidityCalibration;
    this.loggingIntervalSec = loggingIntervalSec;
    this.sensorIntervalSec = sensorIntervalSec;
    this.advertisingFrequencyMs = advertisingFrequencyMs;
    this.pin = pin;
    this.checkDate = checkDate;
  }

  public static fromObject(o: any): BeaconSettings {

    return new BeaconSettings(
      o.id,
      o.beaconId,
      o.deviceName,
      o.firmwareVersionCode,
      o.transmitPowerDb,
      o.batteryLevel,
      o.temperatureUnits,
      o.memoryCapacity,
      o.refTime,
      o.deviceId,
      o.physicalButtonEnabled,
      o.temperatureCalibration,
      o.humidityCalibration,
      o.loggingIntervalSec,
      o.sensorIntervalSec,
      o.advertisingFrequencyMs,
      o.pin,
      o.checkDate
    );

  }

}
