import { AuthSession } from "@/core/types";
import { GetAllUserDTO } from "./user.dto";
import { IUserService } from "./user.service.interfaces";

export class UserController {
  constructor(private userService: IUserService) {}

  async getAll(dto: GetAllUserDTO, auth: AuthSession) {
    const { meta, users } = await this.userService.getAll(dto, auth);
    return { meta, users };
  }
}
