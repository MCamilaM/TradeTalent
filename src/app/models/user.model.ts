export interface User{

    uid: string,
    email: string,
    password: string,
    name: string,
    biography?: string,
    image?: string | null | ''| undefined,
    abilities?: string,
    country?: string,
    priceForHour?: number,
    
}