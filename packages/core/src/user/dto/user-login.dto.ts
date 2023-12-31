import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { IUserLoginInput, IUserSignInWorkspaceInput } from "@gauzy/contracts";
import { IsNotEmpty, IsOptional } from "class-validator";
import { UserEmailDTO } from "./user-email.dto";
import { UserPasswordDTO } from "./user-password.dto";


export class UserSignInWorkspaceDTO extends IntersectionType(
    UserEmailDTO,
    UserPasswordDTO
) implements IUserSignInWorkspaceInput { }

/**
 * User login DTO validation
 */
export class UserLoginDTO extends UserSignInWorkspaceDTO implements IUserLoginInput {

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsNotEmpty()
    readonly magic_code: string;
}
