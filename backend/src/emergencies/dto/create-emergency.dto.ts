import { IsIn, IsLatitude, IsLongitude, IsOptional, IsString, Length } from 'class-validator';
import { EMERGENCY_SOURCES } from '../constants/emergency-source.constant.js';

/** Cuerpo validado de una llamada entrante. */
export class CreateEmergencyDto {
  /** Texto transcrito o escrito. Se limita el tamaño a propósito. */
  @IsString()
  @Length(3, 1000)
  reportText: string;

  @IsOptional()
  @IsIn(Object.values(EMERGENCY_SOURCES))
  source?: string;

  @IsString()
  @Length(3, 160)
  addressLabel: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
