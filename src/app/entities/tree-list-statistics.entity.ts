
/**
 * All statistics to be displayed on the tree list page.
 *
 * @author Laurenz Fiala
 * @since 2018/05/23
 */
export class TreeListStatistics {

  public cityAmount: number;
  public treeAmount: number;
  public treeSpeciesAmount: number;
  public phenologyObservationAmount: number;
  public phenologyObservationObjectAmount: number;
  public beaconAmount: number;
  public beaconDatasetAmount: number;

  public beaconTempMinimum: number;
  public beaconTempAverage: number;
  public beaconTempMaximum: number;

  public beaconHumidityMinimum: number;
  public beaconHumidityAverage: number;
  public beaconHumidityMaximum: number;

  constructor(
    cityAmount: number,
    treeAmount: number,
    treeSpeciesAmount: number,
    phenologyObservationAmount: number,
    phenologyObservationObjectAmount: number,
    beaconAmount: number,
    beaconDatasetAmount: number,
    beaconTempMinimum: number,
    beaconTempAverage: number,
    beaconTempMaximum: number,
    beaconHumidityMinimum: number,
    beaconHumidityAverage: number,
    beaconHumidityMaximum: number
  ) {
    this.cityAmount = cityAmount;
    this.treeAmount = treeAmount;
    this.treeSpeciesAmount = treeSpeciesAmount;
    this.phenologyObservationAmount = phenologyObservationAmount;
    this.phenologyObservationObjectAmount = phenologyObservationObjectAmount;
    this.beaconAmount = beaconAmount;
    this.beaconDatasetAmount = beaconDatasetAmount;
    this.beaconTempMinimum = beaconTempMinimum;
    this.beaconTempAverage = beaconTempAverage;
    this.beaconTempMaximum = beaconTempMaximum;
    this.beaconHumidityMinimum = beaconHumidityMinimum;
    this.beaconHumidityAverage = beaconHumidityAverage;
    this.beaconHumidityMaximum = beaconHumidityMaximum;
  }

  public static fromObject(o: any): TreeListStatistics {

    return new TreeListStatistics(
      o.cityAmount,
      o.treeAmount,
      o.treeSpeciesAmount,
      o.phenologyObservationAmount,
      o.phenologyObservationObjectAmount,
      o.beaconAmount,
      o.beaconDatasetAmount,
      o.beaconTempMinimum,
      o.beaconTempAverage,
      o.beaconTempMaximum,
      o.beaconHumidityMinimum,
      o.beaconHumidityAverage,
      o.beaconHumidityMaximum
    );

  }

}
