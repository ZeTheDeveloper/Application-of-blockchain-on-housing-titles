export class HousingTitle{
    constructor(
        public ID: string,
        public identityNum: string,
        public name: string,
        public address: string,
        public state: string,
        public hash: string,
        public date: string | null,
        public fileName: string
    ) {}
}