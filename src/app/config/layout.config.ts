import { Injectable } from "@angular/core";
/**
 * Layout configuration.
 *
 * @author Laurenz Fiala
 * @since 2019/09/09
 */
@Injectable()
export class LayoutConfig {

  public static LAYOUT_MEDIA_XS: string = '(max-width: 575px)';
  public static LAYOUT_MEDIA_SM: string = '(min-width: 576px) and (max-width: 767px)';
  public static LAYOUT_MEDIA_MD: string = '(min-width: 768px) and (max-width: 991px)';
  public static LAYOUT_MEDIA_LG: string = '(min-width: 992px) and (max-width: 1199px)';
  public static LAYOUT_MEDIA_XL: string = '(min-width: 1200px)';

  public static LAYOUT_MEDIA_STEPS: Array<string> = [
    LayoutConfig.LAYOUT_MEDIA_XS,
    LayoutConfig.LAYOUT_MEDIA_SM,
    LayoutConfig.LAYOUT_MEDIA_MD,
    LayoutConfig.LAYOUT_MEDIA_LG,
    LayoutConfig.LAYOUT_MEDIA_XL
  ];

}
