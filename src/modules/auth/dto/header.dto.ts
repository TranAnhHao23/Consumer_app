import { Expose } from "class-transformer";

export class HeadersDTO {
  @Expose({ name: 'Accept-Language' })
  acceptLanguage: string;

  @Expose({ name: 'userSessionId' })
  userSessionId: string;
}
