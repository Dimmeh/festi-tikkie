export interface IAccountFormValues {
    usr_name:string;
    usr_email:string;
    usr_password?:string;
    usr_profile_photo_url: FileList | string;
}
