export interface RegisterBody{
    username:string;
    email:string;
    password:string;
    name:string;
    city:string;
    role?:"candidate" | "recruiter";
}