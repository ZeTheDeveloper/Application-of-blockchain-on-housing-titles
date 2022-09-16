export class CreateUsers{
    constructor(
        public username: string,
        public password: string,
        public identityNumber: number | null,
        public mobileNumber: string

    ) {}
}