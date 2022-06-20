import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressProfileDto } from './create-address_profile.dto';

export class UpdateAddressProfileDto extends PartialType(
  CreateAddressProfileDto,
) {
  address: string;

  provinceId: string;

  districtId: string;

  subDistrictId: string;
}
