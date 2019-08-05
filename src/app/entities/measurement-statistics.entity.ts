
/**
 * Statistics about the system.
 *
 * @author Laurenz Fiala
 * @since 2018/07/14
 */
export class MeasurementStatistics {

  public beaconTempMinimum: number;
  public beaconTempAverage: number;
  public beaconTempMaximum: number;

  public beaconHumidityMinimum: number;
  public beaconHumidityAverage: number;
  public beaconHumidityMaximum: number;

  constructor(
    beaconTempMinimum: number,
    beaconTempAverage: number,
    beaconTempMaximum: number,
    beaconHumidityMinimum: number,
    beaconHumidityAverage: number,
    beaconHumidityMaximum: number
  ) {
    this.beaconTempMinimum = beaconTempMinimum;
    this.beaconTempAverage = beaconTempAverage;
    this.beaconTempMaximum = beaconTempMaximum;
    this.beaconHumidityMinimum = beaconHumidityMinimum;
    this.beaconHumidityAverage = beaconHumidityAverage;
    this.beaconHumidityMaximum = beaconHumidityMaximum;
  }

  public static fromObject(o: any): MeasurementStatistics {

    return new MeasurementStatistics(
      o.beaconTempMinimum,
      o.beaconTempAverage,
      o.beaconTempMaximum,
      o.beaconHumidityMinimum,
      o.beaconHumidityAverage,
      o.beaconHumidityMaximum
    );

  }

}
