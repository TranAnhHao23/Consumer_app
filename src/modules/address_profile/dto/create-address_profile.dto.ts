import { IsNotEmpty } from 'class-validator';

export class CreateAddressProfileDto {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  provinceId: string;

  @IsNotEmpty()
  districtId: string;

  @IsNotEmpty()
  subDistrictId: string;
}
