export class Users{
    constructor(
        public username: string | null,
        public oldPassword: string,
        public password: string,
        public confirmPassword: string,

    ) {}
}