export class Fso {
    constructor(
        public id:string,
        public name:string,
        public path:string,
        public relativePath:string,
        public size:number,
        public childFolders:[Fso],
        public files:[Fso],
        public selected:boolean,
        public expanded:boolean,
        public media_file_type:number
    ){}
}