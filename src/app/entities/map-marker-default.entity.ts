/**
 * A default map marker only with neccessary fields.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
import {MapMarker} from '../interfaces/map-marker.entity';

export class MapMarkerDefault implements MapMarker {

  public id: number;
  public coordsX: number;
  public coordsY: number;
  public selected: boolean = true;

  constructor(coordsX: number, coordsY: number, id?: number) {
    if (id === undefined) {
      this.id = new Date().getDate();
    } else {
      this.id = id;
    }
    this.coordsX = coordsX;
    this.coordsY = coordsY;
  }

  public getCoordsX(): number {
    return this.coordsX;
  }

  public getCoordsY(): number {
    return this.coordsY;
  }

  public getId(): number {
    return this.id;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

}
