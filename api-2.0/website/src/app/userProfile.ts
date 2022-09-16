export class UserProfiles{
    constructor(
        public username: string | null,
        public identityNumber: string | null,
        public address: string | null,
        public postCode: string | null,
        public state: string | null,
        public area: string | null,
        public country: string | null,
        public mobileNumber: string | null,
        public email: string | null

    ) {}
}