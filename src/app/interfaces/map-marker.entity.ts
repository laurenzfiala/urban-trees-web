/**
 * A marker that can be selected and displayed on the map.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
export interface MapMarker {

  getId(): number;
  getCoordsX(): number;
  getCoordsY(): number;
  getProjection(): string;

}
