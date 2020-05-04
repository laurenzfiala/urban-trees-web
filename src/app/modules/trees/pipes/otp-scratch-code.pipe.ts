import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {StringModificationPipe, StringModificationType} from './strmod.pipe';

/**
 * Pipe to display scratch codes in a user-friendly way
 * with dashes.
 */
@Pipe({name: 'otpScratchCode'})
export class OtpScratchCodePipe implements PipeTransform {

  /**
   * Amount of characters in a scratch code segment.
   */
  private static SEGMENT_LENGTH = 5;

  public transform(value: string): string {

    if (!value) {
      return '';
    }

    let displayCode = '';
    for (let i = 0; i < value.length; i += OtpScratchCodePipe.SEGMENT_LENGTH) {
      if (displayCode.length > 0) {
        displayCode += '-';
      }
      displayCode += value.substring(i, Math.min(i + OtpScratchCodePipe.SEGMENT_LENGTH, value.length));
    }
    return displayCode;

  }

}
